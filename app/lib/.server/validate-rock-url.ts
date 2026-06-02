const ALLOWED_HOSTS = new Set(['rock.christfellowship.church']);

/**
 * Validates a Rock RMS URL string.
 * Throws a `Response` on any validation failure.
 * Returns the validated URL string on success.
 */
export function validateRockUrlString(targetUrl: string | null): string {
  if (!targetUrl) {
    throw new Response('URL parameter required', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    throw new Response('Invalid URL', { status: 400 });
  }

  if (parsed.protocol !== 'https:') {
    throw new Response('HTTPS only', { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Response('Host not allowed', { status: 403 });
  }

  return targetUrl;
}

/**
 * Validates a Rock RMS URL from a request's `url` query parameter.
 * Throws a `Response` on any validation failure.
 * Returns the validated URL string on success.
 */
export function validateRockUrl(request: Request): string {
  const url = new URL(request.url);
  return validateRockUrlString(url.searchParams.get('url'));
}
