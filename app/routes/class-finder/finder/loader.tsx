import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';

import type { ClassHitType } from '../types';
import {
  buildClassFinderAlgoliaSearchParams,
  CLASS_FINDER_FACET_ATTRIBUTES,
} from './components/build-class-finder-algolia-search';
import { parseClassFinderUrlState } from './components/class-finder-url-state';

export type ClassFinderFacetItem = {
  value: string;
  label: string;
  count: number;
};

export type LoaderReturnType = {
  classHits: ClassHitType[];
  classFacets: Record<string, ClassFinderFacetItem[]>;
};

function mapFacetRecord(
  facets: Record<string, Record<string, number>> | undefined,
): Record<string, ClassFinderFacetItem[]> {
  const out: Record<string, ClassFinderFacetItem[]> = {};
  if (!facets) return out;
  for (const attr of CLASS_FINDER_FACET_ATTRIBUTES) {
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
 * Server-only Algolia fetch for `/class-finder`.
 * URL search params drive the query; credentials stay on the server.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let classHits: ClassHitType[] = [];
  let classFacets: Record<string, ClassFinderFacetItem[]> = {};

  const url = new URL(request.url);
  const urlState = parseClassFinderUrlState(url.searchParams);

  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const built = buildClassFinderAlgoliaSearchParams(urlState);
    const { indexName, ...indexSearchParams } = built;

    const res = await client.searchSingleIndex({
      indexName,
      searchParams: {
        ...indexSearchParams,
        facets: [...CLASS_FINDER_FACET_ATTRIBUTES],
        maxValuesPerFacet: 50,
      },
    });

    classHits = (res.hits ?? []).map((h) => h as unknown as ClassHitType);
    classFacets = mapFacetRecord(
      res.facets as Record<string, Record<string, number>> | undefined,
    );
  } catch (error) {
    console.error('[class-finder] Algolia loader fetch failed', error);
  }

  return Response.json({
    classHits,
    classFacets,
  } satisfies LoaderReturnType);
};
