import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';

import { buildGroupFinderAlgoliaSearchParams } from './components/build-group-finder-algolia-search';
import { parseGroupFinderUrlState } from './group-finder-url-state';
import type { GroupType } from './types';

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  groupHits: GroupType[];
  groupNbHits: number;
  groupNbPages: number;
  groupPage: number;
};

/**
 * Initial Algolia fetch for group finder.
 * This seeds first paint from the loader; after hydration, InstantSearch uses
 * the client search key for interactive filtering/searching on this page.
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
  const url = new URL(request.url);

  // The loader owns first paint and deep links. Once hydrated, same-page filter
  // changes are handled by InstantSearch, but a full request must still reflect
  // the URL so shared links and refreshes render correctly.
  const urlState = parseGroupFinderUrlState(url.searchParams);
  const groupPage = urlState.page ?? 0;

  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const built = buildGroupFinderAlgoliaSearchParams(urlState);
    const { indexName, ...indexSearchParams } = built;
    const hitsRes = await client.searchSingleIndex({
      indexName,
      searchParams: indexSearchParams,
    });

    groupHits = (hitsRes.hits ?? []).map((h) => h as unknown as GroupType);
    groupNbHits = hitsRes.nbHits ?? 0;
    groupNbPages = hitsRes.nbPages ?? 0;
  } catch (error) {
    console.error('[group-finder] Algolia loader fetch failed', error);
  }

  return Response.json({
    // Expose only the search key needed by Algolia's browser client; interactive
    // filtering then continues client-side without re-running this loader.
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    groupHits,
    groupNbHits,
    groupNbPages,
    groupPage,
  } satisfies LoaderReturnType);
};
