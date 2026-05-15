import type { LoaderFunctionArgs } from 'react-router';
import { algoliasearch } from 'algoliasearch';

import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';
import type { ContentItemHit } from '~/routes/search/types';

import {
  parseEventsFinderUrlState,
  type EventsFinderUrlState,
} from '../events-url-state';
import {
  EVENTS_INDEX,
  MAIN_EVENTS_GRID_HITS_PER_PAGE,
  MAIN_EVENTS_TYPE_FILTER,
} from './components/events-tags-refinement.component';

const FEATURED_FILTER = 'contentType:"Event" AND eventIsFeatured:true';
const FEATURED_HITS_PER_PAGE = 4;

export interface AllEventsLoaderData {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  featuredHits: ContentItemHit[];
  initialEventHits: ContentItemHit[];
}

function refinementListToFacetFilters(
  refinementList: Record<string, string[]> | undefined,
): string[][] | undefined {
  if (!refinementList || Object.keys(refinementList).length === 0) {
    return undefined;
  }
  const groups: string[][] = [];
  for (const [attr, values] of Object.entries(refinementList)) {
    if (!values?.length) {
      continue;
    }
    groups.push(values.map((v) => `${attr}:"${escapeAlgoliaFilterString(v)}"`));
  }
  return groups.length > 0 ? groups : undefined;
}

/** Same filters / pagination / query as `<Configure>` + URL routing. */
function buildMainEventsSearchParams(urlState: EventsFinderUrlState): {
  filters: string;
  hitsPerPage: number;
  page: number;
  query?: string;
  facetFilters?: string[][];
} {
  const params: {
    filters: string;
    hitsPerPage: number;
    page: number;
    query?: string;
    facetFilters?: string[][];
  } = {
    filters: MAIN_EVENTS_TYPE_FILTER,
    hitsPerPage: MAIN_EVENTS_GRID_HITS_PER_PAGE,
    page: urlState.page ?? 0,
  };
  const q = urlState.query?.trim();
  if (q) {
    params.query = q;
  }
  const facetFilters = refinementListToFacetFilters(urlState.refinementList);
  if (facetFilters) {
    params.facetFilters = facetFilters;
  }
  return params;
}

function sortEventHitsByStartDateDesc(
  hits: ContentItemHit[],
): ContentItemHit[] {
  return [...hits].sort(
    (a, b) =>
      new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime(),
  );
}

/** Single featured "Journey" card (title match) moved to the front when present. */
function moveFeaturedJourneyCardFirst(
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID ?? '';
  const ALGOLIA_SEARCH_API_KEY = process.env.ALGOLIA_SEARCH_API_KEY ?? '';

  let featuredHits: ContentItemHit[] = [];
  let initialEventHits: ContentItemHit[] = [];

  if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY) {
    const url = new URL(request.url);
    const urlState = parseEventsFinderUrlState(url.searchParams);
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {});

    try {
      const [featuredRes, mainRes] = await Promise.all([
        client.searchForHits<Record<string, unknown>>([
          {
            indexName: EVENTS_INDEX,
            params: {
              filters: FEATURED_FILTER,
              hitsPerPage: FEATURED_HITS_PER_PAGE,
            },
          },
        ]),
        client.searchSingleIndex({
          indexName: EVENTS_INDEX,
          searchParams: buildMainEventsSearchParams(urlState),
        }),
      ]);

      const rawFeatured = featuredRes.results[0]?.hits ?? [];
      const mappedFeatured = rawFeatured.map(
        (h) => h as unknown as ContentItemHit,
      );
      featuredHits = moveFeaturedJourneyCardFirst(mappedFeatured);

      const rawMain = mainRes.hits ?? [];
      initialEventHits = sortEventHitsByStartDateDesc(
        rawMain.map((h) => h as unknown as ContentItemHit),
      );
    } catch (error) {
      console.error('[events/all-events] Algolia loader fetch failed', error);
    }
  }

  return Response.json({
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    featuredHits,
    initialEventHits,
  } satisfies AllEventsLoaderData);
};
