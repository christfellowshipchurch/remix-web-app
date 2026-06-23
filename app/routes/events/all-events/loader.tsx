import type { LoaderFunctionArgs } from 'react-router';
import { algoliasearch } from 'algoliasearch';

import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';
import { getServerAlgoliaIndexes } from '~/lib/.server/algolia-indexes.server';
import type { AlgoliaIndexMap } from '~/lib/algolia-indexes';
import type { ContentItemHit } from '~/routes/search/types';

import {
  MAIN_EVENTS_GRID_HITS_PER_PAGE,
  MAIN_EVENTS_TYPE_FILTER,
} from './all-events.constants';
import {
  parseEventsFinderUrlState,
  type EventsFinderUrlState,
} from '../events-url-state';

const FEATURED_FILTER = 'contentType:"Event" AND eventIsFeatured:true';
const FEATURED_HITS_PER_PAGE = 4;

export type EventFinderFacetItem = {
  value: string;
  label: string;
  count: number;
};

export interface AllEventsLoaderData {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  algoliaIndexes: AlgoliaIndexMap;
  featuredHits: ContentItemHit[];
  mainEventHits: ContentItemHit[];
  eventsNbPages: number;
  eventsPage: number;
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
  const appId = process.env.ALGOLIA_APP_ID ?? '';
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY ?? '';
  const algoliaIndexes = getServerAlgoliaIndexes();

  let featuredHits: ContentItemHit[] = [];
  let mainEventHits: ContentItemHit[] = [];
  let eventsNbPages = 0;

  const url = new URL(request.url);
  const urlState = parseEventsFinderUrlState(url.searchParams);
  const eventsPage = urlState.page ?? 0;

  if (appId && searchApiKey) {
    const client = algoliasearch(appId, searchApiKey, {});

    try {
      const [featuredRes, mainRes] = await Promise.all([
        client.searchForHits<Record<string, unknown>>([
          {
            indexName: algoliaIndexes.contentItems,
            params: {
              filters: FEATURED_FILTER,
              hitsPerPage: FEATURED_HITS_PER_PAGE,
            },
          },
        ]),
        client.searchSingleIndex({
          indexName: algoliaIndexes.contentItems,
          searchParams: buildMainEventsSearchParams(urlState),
        }),
      ]);

      const rawFeatured = featuredRes.results[0]?.hits ?? [];
      featuredHits = moveFeaturedJourneyCardFirst(
        rawFeatured.map((h) => h as unknown as ContentItemHit),
      );

      const rawMain = mainRes.hits ?? [];
      mainEventHits = sortEventHitsByStartDateDesc(
        rawMain.map((h) => h as unknown as ContentItemHit),
      );
      eventsNbPages = mainRes.nbPages ?? 0;
    } catch (error) {
      console.error('[events/all-events] Algolia loader fetch failed', error);
    }
  }

  return Response.json({
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    algoliaIndexes,
    featuredHits,
    mainEventHits,
    eventsNbPages,
    eventsPage,
  } satisfies AllEventsLoaderData);
};
