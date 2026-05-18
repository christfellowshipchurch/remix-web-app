import type { SearchClient } from 'algoliasearch';

import type { LoaderReturnType } from '../loader';
import { CLASSES_ALGOLIA_INDEX_NAME } from './build-class-single-algolia-search';

function facetMapToAlgoliaFacets(
  upcomingFacets: LoaderReturnType['upcomingFacets'],
): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const [attr, items] of Object.entries(upcomingFacets)) {
    out[attr] = {};
    for (const item of items) {
      out[attr][item.value] = item.count;
    }
  }
  return out;
}

/**
 * Stub SearchClient for Filter Sessions widgets only.
 * Carousel hits come from `loaderData.upcomingHits`, not `<Hits>`.
 */
export function createClassSingleLoaderSearchClient(
  data: LoaderReturnType,
): SearchClient {
  const facets = facetMapToAlgoliaFacets(data.upcomingFacets);

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
          hits: data.upcomingHits,
          nbHits: data.upcomingHits.length,
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
