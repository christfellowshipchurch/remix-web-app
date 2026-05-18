import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';

import {
  buildGroupFinderAlgoliaSearchParams,
  GROUP_FINDER_FACET_ATTRIBUTES,
} from './components/build-group-finder-algolia-search';
import { parseGroupFinderUrlState } from './group-finder-url-state';
import type { GroupType } from './types';

export type GroupFinderFacetItem = {
  value: string;
  label: string;
  count: number;
};

export type LoaderReturnType = {
  groupHits: GroupType[];
  groupNbHits: number;
  groupNbPages: number;
  groupPage: number;
  groupFacets: Record<string, GroupFinderFacetItem[]>;
};

function mapFacetRecord(
  facets: Record<string, Record<string, number>> | undefined,
): Record<string, GroupFinderFacetItem[]> {
  const out: Record<string, GroupFinderFacetItem[]> = {};
  if (!facets) return out;
  for (const attr of GROUP_FINDER_FACET_ATTRIBUTES) {
    const slice = facets[attr];
    if (!slice) continue;
    out[attr] = Object.entries(slice)
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }
  return out;
}

/**
 * Server-only Algolia fetch for group finder.
 * URL search params are the source of truth: each navigation re-runs this loader and
 * returns hits + facet counts for the current filters (no Algolia keys on the client).
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let groupHits: GroupType[] = [];
  let groupNbHits = 0;
  let groupNbPages = 0;
  let groupFacets: Record<string, GroupFinderFacetItem[]> = {};

  const url = new URL(request.url);
  const urlState = parseGroupFinderUrlState(url.searchParams);
  const groupPage = urlState.page ?? 0;

  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const built = buildGroupFinderAlgoliaSearchParams(urlState);
    const { indexName, ...indexSearchParams } = built;
    // One request returns both the result page and facet values for filter popups.
    const hitsRes = await client.searchSingleIndex({
      indexName,
      searchParams: {
        ...indexSearchParams,
        facets: [...GROUP_FINDER_FACET_ATTRIBUTES],
        maxValuesPerFacet: 50,
      },
    });

    groupHits = (hitsRes.hits ?? []).map((h) => h as unknown as GroupType);
    groupNbHits = hitsRes.nbHits ?? 0;
    groupNbPages = hitsRes.nbPages ?? 0;
    groupFacets = mapFacetRecord(
      hitsRes.facets as Record<string, Record<string, number>> | undefined,
    );
  } catch (error) {
    console.error('[group-finder] Algolia loader fetch failed', error);
  }

  return Response.json({
    groupHits,
    groupNbHits,
    groupNbPages,
    groupPage,
    groupFacets,
  } satisfies LoaderReturnType);
};
