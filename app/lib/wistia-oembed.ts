const WISTIA_OEMBED_BASE = 'https://fast.wistia.com/oembed';

export function buildWistiaEmbedMediasPageUrl(wistiaId: string): string {
  return `https://fast.wistia.com/embed/medias/${wistiaId.trim()}`;
}

/** Public oEmbed URL (no API key); response includes thumbnail_url. */
export function buildWistiaOEmbedRequestUrl(wistiaId: string): string {
  const pageUrl = buildWistiaEmbedMediasPageUrl(wistiaId);
  return `${WISTIA_OEMBED_BASE}?url=${encodeURIComponent(pageUrl)}`;
}

/** Tiny placeholder image; shows immediately while oEmbed thumbnail loads. */
export function buildWistiaSwatchImageUrl(wistiaId: string): string {
  return `${buildWistiaEmbedMediasPageUrl(wistiaId)}/swatch`;
}

export interface WistiaOEmbedPayload {
  thumbnail_url?: string;
}
