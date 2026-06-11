import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';
import { getServerAlgoliaIndexes } from '~/lib/.server/algolia-indexes.server';
import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import type { RockContentChannelItem } from '~/lib/types/rock-types';
import type { GroupType } from '~/routes/group-finder/types';
import type { AlgoliaIndexMap } from '~/lib/algolia-indexes';

import type { ClassHitType } from '../types';
import {
  buildClassSingleGroupsSearchParams,
  buildClassSingleHeroSearchParams,
  buildClassSingleUpcomingSearchParams,
} from './components/build-class-single-algolia-search';
import { parseClassSingleUrlState } from './class-single-url-state';

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  algoliaIndexes: AlgoliaIndexMap;
  classUrl: string;
  classHit: ClassHitType | null;
  upcomingHits: ClassHitType[];
  groupHits: GroupType[];
  discussionGuideUrl: string;
  classTrailer: string;
  onDemandUrl: string;
};

function rockStringAttr(
  item: RockContentChannelItem | null | undefined,
  key: string,
): string {
  const v = item?.attributeValues?.[key]?.value;
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Initial Algolia fetch for class-single:
 * 1. Hero class by URL path (`pathName`)
 * 2. Upcoming sessions for that class type + filter URL (incl. lat/lng)
 * 3. Related groups mirroring the same refinements/geo
 *
 * This seeds first paint. After hydration, Filter Sessions and related groups
 * use client-side InstantSearch for interaction on this route.
 */
export async function loader({ params, request }: LoaderFunctionArgs) {
  const classUrl = params.path || '';

  if (!classUrl) {
    throw new Error('Class not found');
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;
  const algoliaIndexes = getServerAlgoliaIndexes();

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let discussionGuideUrl = '';
  let classTrailer = '';
  let onDemandUrl = '';

  try {
    const classData = (await fetchRockData({
      endpoint: 'DefinedValues/GetByAttributeValue',
      queryParams: {
        attributeKey: 'Url',
        value: classUrl,
        loadAttributes: 'simple',
        $top: '1',
      },
    })) as RockContentChannelItem | undefined;

    if (classData) {
      discussionGuideUrl = rockStringAttr(classData, 'discussionGuide');
      classTrailer = rockStringAttr(classData, 'classTrailer');
      onDemandUrl = rockStringAttr(classData, 'onDemandSignUpLink');
    }
  } catch (error) {
    console.warn('Failed to load class data from Rock:', error);
  }

  let classHit: ClassHitType | null = null;
  let upcomingHits: ClassHitType[] = [];
  let groupHits: GroupType[] = [];

  const url = new URL(request.url);

  // Deep-linked filters should affect the initial server-rendered session and
  // related-group carousels. After hydration, the same URL shape is maintained
  // by client-side InstantSearch for interactions.
  const urlState = parseClassSingleUrlState(url.searchParams);
  const client = algoliasearch(appId, searchApiKey, {});

  try {
    const heroBuilt = buildClassSingleHeroSearchParams(
      classUrl,
      algoliaIndexes.classes,
    );
    const { indexName: heroIndex, ...heroParams } = heroBuilt;
    const heroRes = await client.searchSingleIndex({
      indexName: heroIndex,
      searchParams: heroParams,
    });

    const firstHit = heroRes.hits?.[0];
    if (firstHit) {
      classHit = firstHit as unknown as ClassHitType;
      const classType = classHit.classType?.trim() ?? '';

      if (classType) {
        // The class type from the hero hit is the canonical value used to scope
        // upcoming sessions and related groups; the route slug can differ from
        // the Algolia classType label shown to users.
        const upcomingBuilt = buildClassSingleUpcomingSearchParams(
          urlState,
          classType,
          algoliaIndexes.classes,
        );
        const groupsBuilt = buildClassSingleGroupsSearchParams(
          urlState,
          classType,
          algoliaIndexes.groups,
        );

        const { indexName: upcomingIndex, ...upcomingParams } = upcomingBuilt;
        const { indexName: groupsIndex, ...groupsParams } = groupsBuilt;

        const [upcomingRes, groupsRes] = await Promise.all([
          client.searchSingleIndex({
            indexName: upcomingIndex,
            searchParams: upcomingParams,
          }),
          client.searchSingleIndex({
            indexName: groupsIndex,
            searchParams: groupsParams,
          }),
        ]);

        upcomingHits = (upcomingRes.hits ?? []).map(
          (h) => h as unknown as ClassHitType,
        );
        groupHits = (groupsRes.hits ?? []).map(
          (h) => h as unknown as GroupType,
        );
      }
    }
  } catch (error) {
    console.error('[class-single] Algolia loader fetch failed', error);
  }

  return {
    // Include the browser search credentials so hydrated filter changes can go
    // straight to Algolia without revalidating this route loader.
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    algoliaIndexes,
    classUrl,
    classHit,
    upcomingHits,
    groupHits,
    discussionGuideUrl,
    classTrailer,
    onDemandUrl,
  };
}
