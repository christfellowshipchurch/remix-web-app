/**
 * Shared metadata for the site. Use createMeta() for consistent title, description, and OG tags.
 */

export const SITE_NAME = "Christ Fellowship Church";

/** Default OG image path. Set VITE_SITE_URL in env for absolute OG URL in production. */
const SITE_URL = import.meta.env.VITE_SITE_URL ?? "";
export const DEFAULT_OG_IMAGE = SITE_URL
  ? `${SITE_URL.replace(/\/$/, "")}/metadata_image.jpg`
  : "/metadata_image.jpg";

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
  const ogImage = image ?? DEFAULT_OG_IMAGE;
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
  if (path && SITE_URL) {
    base.push({
      property: "og:url",
      content: `${SITE_URL.replace(/\/$/, "")}${path}`,
    });
  }
  if (noIndex) {
    base.push({ name: "robots", content: "noindex, nofollow" });
  }
  return base;
}
