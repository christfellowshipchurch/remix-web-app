export function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}

export function hasValidHref(href?: string): boolean {
  return Boolean(href?.trim());
}

/** Normalizes Rock podcast show URL values to in-app routes. */
export function getPodcastShowHref(url: string): string {
  if (!url?.trim()) {
    return '';
  }

  const trimmed = url.trim();

  if (isExternalHref(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/podcasts/')) {
    return trimmed;
  }

  const slug = trimmed.replace(/^\/+/, '').replace(/^podcasts\/?/, '');
  return slug ? `/podcasts/${slug}` : '/podcasts';
}
