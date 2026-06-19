/** Allowed origins for parent navigation triggered by Rock iframe postMessage. */
const PRODUCTION_SITE_ORIGINS = new Set([
  'https://christfellowship.church',
  'https://www.christfellowship.church',
]);

/**
 * Resolve a navigation target from a Rock iframe postMessage.
 * Accepts same-origin paths or absolute URLs on the public site.
 */
export function resolveRockIframeNavigateUrl(
  rawUrl: string,
  currentOrigin: string,
): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const allowedOrigins = new Set([currentOrigin, ...PRODUCTION_SITE_ORIGINS]);

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    try {
      const url = new URL(trimmed, currentOrigin);
      if (!allowedOrigins.has(url.origin)) return null;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!allowedOrigins.has(url.origin)) return null;
    return url.href;
  } catch {
    return null;
  }
}
