import type { SearchClient } from 'algoliasearch';

import type { LoaderReturnType } from '../loader';
import { GROUPS_ALGOLIA_INDEX_NAME } from '../types';

function facetMapToAlgoliaFacets(
  groupFacets: LoaderReturnType['groupFacets'],
): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const [attr, items] of Object.entries(groupFacets)) {
    out[attr] = {};
    for (const item of items) {
      out[attr][item.value] = item.count;
    }
  }
  return out;
}

/**
 * Returns loader-prefetched hits/facets for InstantSearch widgets without browser Algolia requests.
 * URL changes re-run the route loader and refresh this client via `useMemo` in `group-search.partial`.
 */
export function createGroupFinderLoaderSearchClient(
  data: LoaderReturnType,
): SearchClient {
  const facets = facetMapToAlgoliaFacets(data.groupFacets);

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
        const indexId = request.indexName ?? GROUPS_ALGOLIA_INDEX_NAME;
        if (indexId !== GROUPS_ALGOLIA_INDEX_NAME) {
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
          hits: data.groupHits,
          nbHits: data.groupNbHits,
          nbPages: data.groupNbPages,
          page: data.groupPage,
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
