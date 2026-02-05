/**
 * Shared metadata for the site. Use createMeta() for consistent title, description, and OG tags.
 */

export const SITE_NAME = "Christ Fellowship Church";

/** Default OG image path (site logo). Absolute URL is built in createMeta using window.location.origin when available. */
export const DEFAULT_OG_IMAGE = "/logo.png";

function getOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

export type CreateMetaOptions = {
  title: string;
  description: string;
  /** Override OG/twitter image (use absolute URL for best compatibility). */
  image?: string;
  /** Optional path for og:url (e.g. /about). */
  path?: string;
  /** If true, add robots noindex. */
  noIndex?: boolean;
};

/**
 * Returns a meta array for React Router meta export. Use for static or dynamic routes.
 * Title is normalized to "Page Title | Christ Fellowship Church" when not already suffixed.
 * OG image and og:url use window.location.origin when available (client); otherwise relative paths (SSR).
 */
export function createMeta({
  title,
  description,
  image,
  path,
  noIndex,
}: CreateMetaOptions): Array<{
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}> {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const origin = getOrigin();
  const imagePath = image ?? DEFAULT_OG_IMAGE;
  const ogImage =
    imagePath.startsWith("http") || !origin
      ? imagePath
      : `${origin}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  const base: Array<{
    title?: string;
    name?: string;
    property?: string;
    content?: string;
  }> = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
  if (path) {
    const ogUrl = origin
      ? `${origin}${path.startsWith("/") ? "" : "/"}${path}`
      : path;
    base.push({ property: "og:url", content: ogUrl });
  }
  if (noIndex) {
    base.push({ name: "robots", content: "noindex, nofollow" });
  }
  return base;
}
