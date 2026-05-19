import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';

import type { ClassHitType } from '../types';
import { buildClassFinderAlgoliaSearchParams } from './components/build-class-finder-algolia-search';
import { parseClassFinderUrlState } from './components/class-finder-url-state';

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  classHits: ClassHitType[];
};

/**
 * Initial Algolia fetch for `/class-finder`.
 * This seeds first paint from the loader; after hydration, InstantSearch uses
 * the client search key for interactive filtering/searching on this page.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let classHits: ClassHitType[] = [];

  const url = new URL(request.url);
  const urlState = parseClassFinderUrlState(url.searchParams);

  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const built = buildClassFinderAlgoliaSearchParams(urlState);
    const { indexName, ...indexSearchParams } = built;

    const res = await client.searchSingleIndex({
      indexName,
      searchParams: indexSearchParams,
    });

    classHits = (res.hits ?? []).map((h) => h as unknown as ClassHitType);
  } catch (error) {
    console.error('[class-finder] Algolia loader fetch failed', error);
  }

  return Response.json({
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    classHits,
  } satisfies LoaderReturnType);
};
