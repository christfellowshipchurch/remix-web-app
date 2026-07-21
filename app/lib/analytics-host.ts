/**
 * Canonical production hostnames for analytics destination routing.
 * Preview/staging (e.g. *.vercel.app) and local must not be treated as production.
 */
export const PRODUCTION_HOSTS = [
  'www.christfellowship.church',
  'christfellowship.church',
] as const;

/**
 * True only when running in the browser on a production hostname.
 * Returns false during SSR or whenever `window` is unavailable.
 */
export function isProductionHost(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (PRODUCTION_HOSTS as readonly string[]).includes(
    window.location.hostname,
  );
}
