import type { ContentItemHit } from '~/routes/search/types';

export type SearchHitContentType =
  | 'Article'
  | 'Event'
  | 'Page Builder'
  | 'Location Page'
  | 'Location'
  | 'Ministry Page'
  | 'Redirect Card'
  | 'Sermon'
  | 'Person'
  | 'Podcast';

/** True when href is a real off-site URL (has a dotted hostname). */
export function isExternalSearchHref(href: string): boolean {
  const trimmed = href.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return false;
  }

  try {
    const { hostname } = new URL(trimmed);
    if (!hostname) {
      return false;
    }

    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return false;
    }

    return hostname.includes('.');
  } catch {
    return false;
  }
}

/** Recover an in-app path from values like `https://events/diesel` (missing domain). */
export function internalPathFromMalformedAbsoluteUrl(url: string): string | null {
  if (isExternalSearchHref(url)) {
    return null;
  }

  try {
    const parsed = new URL(url.trim());
    const path = `/${parsed.hostname}${parsed.pathname}${parsed.search}${parsed.hash}`
      .replace(/\/{2,}/g, '/')
      .replace(/\/+$/, '');

    return path === '' ? '/' : path;
  } catch {
    return null;
  }
}

export function ensureLeadingSlash(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Normalize raw URL/path values from Algolia before routing rules run. */
export function normalizeSearchContentUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    if (isExternalSearchHref(trimmed)) {
      return trimmed;
    }

    return (
      internalPathFromMalformedAbsoluteUrl(trimmed) ?? ensureLeadingSlash(trimmed)
    );
  }

  return ensureLeadingSlash(trimmed);
}

export function getSearchHitPathname(
  contentType: SearchHitContentType | string,
  pathname: string,
  hit?: ContentItemHit,
): string {
  if (!contentType || !pathname?.trim()) {
    return pathname?.trim() ?? '';
  }

  const contentTypeLower = contentType.toLowerCase();
  const normalizedPath = normalizeSearchContentUrl(pathname);

  let podcastShow = 'so-good-sisterhood';
  if (hit) {
    podcastShow =
      hit.podcastShow?.toLowerCase().replace(/ /g, '-').replace(/\+/g, 'and') ||
      'so-good-sisterhood';
  }

  if (
    contentTypeLower === 'redirect card' ||
    contentTypeLower === 'page builder'
  ) {
    return normalizedPath;
  }

  if (isExternalSearchHref(normalizedPath)) {
    return normalizedPath;
  }

  const slug = normalizedPath.replace(/^\/+/, '');

  if (contentTypeLower === 'ministry page') {
    return `/ministries/${slug}`;
  }

  if (contentTypeLower === 'sermon') {
    return `/messages/${slug}`;
  }

  if (contentTypeLower === 'podcast') {
    return `/podcasts/${podcastShow}/${slug}`;
  }

  if (contentTypeLower === 'article') {
    return `/articles/${slug}`;
  }

  if (contentTypeLower === 'event') {
    return `/events/${slug}`;
  }

  if (contentTypeLower === 'location page' || contentTypeLower === 'location') {
    return `/locations/${slug}`;
  }

  return `/${contentTypeLower}/${slug}`;
}

export function resolveSearchHitLink(
  contentType: string,
  rawUrl: string,
  hit?: ContentItemHit,
): { to: string; isExternal: boolean } {
  const to = getSearchHitPathname(contentType, rawUrl, hit);

  return {
    to,
    isExternal: isExternalSearchHref(to),
  };
}

export function resolveSearchHitLinkFromHit(hit: {
  contentType: string;
  url?: string;
  routing?: { pathname?: string };
}): { to: string; isExternal: boolean } {
  const rawUrl = hit.url?.trim() || hit.routing?.pathname?.trim() || '';

  return resolveSearchHitLink(hit.contentType, rawUrl, hit as ContentItemHit);
}
