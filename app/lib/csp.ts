import { ROCK_PUBLIC_SITE_ORIGIN } from '~/lib/rock-config';

/**
 * Builds a nonce'd Content-Security-Policy header value.
 *
 * frame-src includes:
 *   'self'                       — /rock-proxy same-origin iframes (advanced proxy mode)
 *   ROCK_PUBLIC_SITE_ORIGIN      — direct Rock embeds (/rock-page, event clickthrough)
 *   GTM / Wistia                 — tag manager + video
 */
export function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://*.wistia.com https://*.wistia.net https://www.clarity.ms https://*.clarity.ms`,
    "style-src 'self' 'unsafe-inline' https://fast.wistia.com",
    "img-src 'self' data: https: blob:",
    // Algolia search & related APIs: https://support.algolia.com/hc/en-us/articles/8947249849873
    // Microsoft Clarity sends telemetry to *.clarity.ms and c.bing.com
    // GA4 collection (fetch/sendBeacon) + GTM
    "connect-src 'self' https://*.algolia.net https://*.algolianet.com https://*.algolia.io https://*.clarity.ms https://c.bing.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    `frame-src 'self' ${ROCK_PUBLIC_SITE_ORIGIN} https://www.googletagmanager.com https://*.wistia.com https://*.wistia.net`,
    "frame-ancestors 'none'",
  ].join('; ');
}
