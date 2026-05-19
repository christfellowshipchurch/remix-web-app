import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';
import { AuthenticationError } from '~/lib/.server/error-types';
import type { ContentItemHit } from '~/routes/search/types';

import {
  ALL_MESSAGES_GRID_HITS_PER_PAGE,
  CURRENT_SERIES_LOADER_HITS_PER_PAGE,
  MESSAGES_ALGOLIA_INDEX_NAME,
  MESSAGES_SERMON_FILTER,
} from './messages-page';
import {
  parseAllMessagesUrlState,
  type AllMessagesUrlState,
} from './all-messages-url-state';

export type AllMessagesLoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  currentSeriesHit: ContentItemHit | null;
  allMessagesHits: ContentItemHit[];
  allMessagesNbPages: number;
  allMessagesPage: number;
};

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

function buildAllMessagesSearchParams(urlState: AllMessagesUrlState): {
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
    filters: MESSAGES_SERMON_FILTER,
    hitsPerPage: ALL_MESSAGES_GRID_HITS_PER_PAGE,
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let currentSeriesHit: ContentItemHit | null = null;
  let allMessagesHits: ContentItemHit[] = [];
  let allMessagesNbPages = 0;

  const url = new URL(request.url);
  const urlState = parseAllMessagesUrlState(url.searchParams);
  const allMessagesPage = urlState.page ?? 0;

  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const [seriesRes, gridRes] = await Promise.all([
      client.searchSingleIndex({
        indexName: MESSAGES_ALGOLIA_INDEX_NAME,
        searchParams: {
          filters: MESSAGES_SERMON_FILTER,
          hitsPerPage: CURRENT_SERIES_LOADER_HITS_PER_PAGE,
        },
      }),
      client.searchSingleIndex({
        indexName: MESSAGES_ALGOLIA_INDEX_NAME,
        searchParams: buildAllMessagesSearchParams(urlState),
      }),
    ]);

    const seriesHits = seriesRes.hits ?? [];
    currentSeriesHit =
      seriesHits.length > 0
        ? (seriesHits[0] as unknown as ContentItemHit)
        : null;

    allMessagesHits = (gridRes.hits ?? []).map(
      (h) => h as unknown as ContentItemHit,
    );
    allMessagesNbPages = gridRes.nbPages ?? 0;
  } catch (error) {
    console.error('[messages/all-messages] Algolia loader fetch failed', error);
  }

  return Response.json({
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    currentSeriesHit,
    allMessagesHits,
    allMessagesNbPages,
    allMessagesPage,
  } satisfies AllMessagesLoaderReturnType);
};
