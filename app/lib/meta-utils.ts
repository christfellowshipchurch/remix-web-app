/**
 * Shared metadata for the site. Use createMeta() for consistent title, description, and OG tags.
 */

export const SITE_NAME = "Christ Fellowship Church";

/** Default image for SEO/OG if none is provided. Located at @public/assets/images/metadata_image.jpg. */
export const DEFAULT_META_IMAGE = "/assets/images/metadata_image.jpg";

/** Default keywords used site-wide when not overridden per route. */
export const DEFAULT_KEYWORDS =
  "Christ Fellowship Church, church South Florida, multisite church, church online, services, groups, ministries, grow in faith, Palm Beach, Broward, Miami";

/** Default generator used site-wide when not overridden per route. */
export const DEFAULT_GENERATOR = "React Router";

/**
 * Origin for absolute OG/twitter image and og:url.
 * Uses only VITE_PUBLIC_ORIGIN so server and client render the same value (avoids hydration mismatch).
 * When unset, meta tags use relative paths (e.g. /assets/images/metadata_image.jpg); crawlers resolve them against the page URL.
 * Set VITE_PUBLIC_ORIGIN in .env for local dev (e.g. http://localhost:5174) and production (e.g. https://yoursite.com) if you want absolute OG URLs.
 */
function getOrigin(): string {
  const env = (import.meta as { env?: Record<string, unknown> }).env;
  const envOrigin = env?.VITE_PUBLIC_ORIGIN;
  return typeof envOrigin === "string" ? envOrigin : "";
}

export type CreateMetaOptions = {
  title: string;
  description: string;
  /** Override OG/twitter image (use absolute URL for best compatibility). */
  image?: string;
  /** Optional path for og:url and canonical link (e.g. /about). */
  path?: string;
  /** If true, add robots noindex. */
  noIndex?: boolean;
  /** Override default keywords (defaults to DEFAULT_KEYWORDS). */
  keywords?: string;
  /** Override default generator (defaults to DEFAULT_GENERATOR). */
  generator?: string;
  /** Optional license URL or text. */
  license?: string;
  /** Author name for meta author, article:author, and twitter:creator. */
  author?: string;
};

type MetaDescriptor =
  | { title?: string; name?: string; property?: string; content?: string }
  | { tagName: "link"; rel: string; href: string };

/**
 * Returns a meta array for React Router meta export. Use for static or dynamic routes.
 * Title is normalized to "Page Title | Christ Fellowship Church" when not already suffixed.
 * OG image and og:url use VITE_PUBLIC_ORIGIN when set (same on server and client to avoid hydration mismatch); otherwise relative paths.
 */
export function createMeta({
  title,
  description,
  image,
  path,
  noIndex,
  keywords,
  generator,
  license,
  author,
}: CreateMetaOptions): MetaDescriptor[] {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const origin = getOrigin();
  const imagePath = image ?? DEFAULT_META_IMAGE;
  const ogImage =
    imagePath.startsWith("http") || !origin
      ? imagePath
      : `${origin}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  const base: MetaDescriptor[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "application-name", content: SITE_NAME },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
  if (author?.trim()) {
    base.push({ name: "author", content: author.trim() });
    base.push({ property: "article:author", content: author.trim() });
    base.push({ name: "twitter:creator", content: author.trim() });
  }
  if (path) {
    const fullUrl = origin
      ? `${origin}${path.startsWith("/") ? "" : "/"}${path}`
      : path.startsWith("/")
      ? path
      : `/${path}`;
    if (origin) {
      base.push({ property: "og:url", content: fullUrl });
    }
    base.push({ tagName: "link", rel: "canonical", href: fullUrl });
  }
  base.push({
    name: "robots",
    content: noIndex ? "noindex, nofollow" : "index, follow",
  });
  base.push({
    name: "keywords",
    content: keywords ?? DEFAULT_KEYWORDS,
  });
  base.push({
    name: "generator",
    content: generator ?? DEFAULT_GENERATOR,
  });
  if (license) {
    base.push({ name: "license", content: license });
  }
  return base;
}
