import type { SearchClient } from 'algoliasearch';

import type { LoaderReturnType } from '../loader';
import { CLASSES_ALGOLIA_INDEX_NAME } from './build-class-finder-algolia-search';

function facetMapToAlgoliaFacets(
  classFacets: LoaderReturnType['classFacets'],
): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const [attr, items] of Object.entries(classFacets)) {
    out[attr] = {};
    for (const item of items) {
      out[attr][item.value] = item.count;
    }
  }
  return out;
}

/**
 * Stub SearchClient for filter widgets (`useRefinementList`, topic pills, popup counts).
 * The grid uses `loaderData.classHits` (grouped client-side), not InstantSearch `<Hits>`.
 */
export function createClassFinderLoaderSearchClient(
  data: LoaderReturnType,
): SearchClient {
  const facets = facetMapToAlgoliaFacets(data.classFacets);

  return {
    search(requests) {
      type LoaderSearchRequest = {
        indexName?: string;
        params?: { query?: string };
      };
      const requestList = (
        Array.isArray(requests) ? requests : [requests]
      ) as LoaderSearchRequest[];

      const results = requestList.map((request) => {
        const indexId = request.indexName ?? CLASSES_ALGOLIA_INDEX_NAME;
        if (indexId !== CLASSES_ALGOLIA_INDEX_NAME) {
          return {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            facets: {},
            exhaustiveNbHits: true,
            processingTimeMS: 0,
            query: '',
            params: '',
          };
        }

        return {
          hits: data.classHits,
          nbHits: data.classHits.length,
          nbPages: 1,
          page: 0,
          facets,
          exhaustiveNbHits: true,
          exhaustiveFacetsCount: true,
          processingTimeMS: 0,
          query:
            typeof request.params?.query === 'string'
              ? request.params.query
              : '',
          params: '',
        };
      });

      return Promise.resolve({ results });
    },
  } as SearchClient;
}
