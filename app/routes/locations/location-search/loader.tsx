import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';

import type { CampusHit } from './partials/location-card-list.partial';
import {
  LOCATION_SEARCH_INDEX_NAME,
  LOCATION_SEARCH_INITIAL_HITS_PER_PAGE,
} from './location-search.constants';

export type LocationSearchLoaderData = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  initialLocationHits: CampusHit[];
};

/**
 * Initial Algolia fetch for `/locations`.
 * This seeds first paint from the loader; after hydration, InstantSearch owns
 * zip/current-location searches and geo-ranking on the client.
 */
export async function loader() {
  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let initialLocationHits: CampusHit[] = [];
  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const res = await client.searchSingleIndex({
      indexName: LOCATION_SEARCH_INDEX_NAME,
      searchParams: {
        hitsPerPage: LOCATION_SEARCH_INITIAL_HITS_PER_PAGE,
        query: '',
        aroundLatLngViaIP: false,
        getRankingInfo: true,
      },
    });

    initialLocationHits = (res.hits ?? []).map(
      (h) => h as unknown as CampusHit,
    );
  } catch (error) {
    console.error(
      '[locations/location-search] Algolia loader fetch failed',
      error,
    );
  }

  return Response.json({
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    initialLocationHits,
  } satisfies LocationSearchLoaderData);
}
