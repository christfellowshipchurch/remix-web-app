import type { ContentItemHit } from '~/routes/search/types';

export const FEATURED_EVENTS_FILTER =
  'contentType:"Event" AND eventIsFeatured:true';
export const FEATURED_EVENTS_HITS_PER_PAGE = 4;

/** Single featured "Journey" card (title match) moved to the front when present. */
export function moveFeaturedJourneyCardFirst(
  hits: ContentItemHit[],
): ContentItemHit[] {
  const i = hits.findIndex((h) =>
    (h.title ?? '').toLowerCase().includes('journey'),
  );
  if (i < 1) {
    return hits;
  }
  const copy = [...hits];
  const [journey] = copy.splice(i, 1);
  return [journey, ...copy];
}
