import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';
import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import type { RockContentChannelItem } from '~/lib/types/rock-types';
import { createImageUrlFromGuid } from '~/lib/utils';
import type { GroupType } from '~/routes/group-finder/types';

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
  classUrl: string;
  classHit: ClassHitType | null;
  upcomingHits: ClassHitType[];
  groupHits: GroupType[];
  discussionGuideUrl: string;
  classTrailer: string;
  onDemandUrl: string;
  /**
   * Hero display fields resolved Rock-first (Defined Type 387), falling back to
   * the Algolia hero hit when the Rock attribute is empty. This lets content
   * editors drive the class page from Rock without a deploy, while preserving
   * existing content for classes not yet populated in the Defined Type.
   */
  heroTitle: string;
  heroSummary: string;
  heroCoverImageUri: string;
};

/**
 * Defined Value from Rock Classes Defined Type (387). Adds the top-level
 * `value` (class name) that the generic content-item type omits; attribute
 * values arrive under `attributeValues` post-normalize.
 */
type RockClassDefinedValue = RockContentChannelItem & {
  value?: string;
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

  if (!appId || !searchApiKey) {
    throw new AuthenticationError('Algolia credentials not found');
  }

  let discussionGuideUrl = '';
  let classTrailer = '';
  let onDemandUrl = '';
  let rockTitle = '';
  let rockSummary = '';
  let rockCoverImageUri = '';

  try {
    const classData = (await fetchRockData({
      endpoint: 'DefinedValues/GetByAttributeValue',
      queryParams: {
        attributeKey: 'Url',
        value: classUrl,
        loadAttributes: 'simple',
        $top: '1',
      },
    })) as RockClassDefinedValue | undefined;

    if (classData) {
      discussionGuideUrl = rockStringAttr(classData, 'discussionGuide');
      classTrailer = rockStringAttr(classData, 'classTrailer');
      onDemandUrl = rockStringAttr(classData, 'onDemandSignUpLink');
      rockTitle = classData.value?.trim() ?? '';
      rockSummary = rockStringAttr(classData, 'summary');
      const imageGuid = rockStringAttr(classData, 'image');
      rockCoverImageUri = imageGuid ? createImageUrlFromGuid(imageGuid) : '';
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
    const heroBuilt = buildClassSingleHeroSearchParams(classUrl);
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
        );
        const groupsBuilt = buildClassSingleGroupsSearchParams(
          urlState,
          classType,
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

  // Rock Defined Type 387 is the authoritative source for hero content.
  // Summary and cover image come from Rock only (no Algolia fallback): when the
  // Defined Value lacks them, the page shows no "What to Expect" copy and hides
  // the hero image. Title still falls back to the Algolia hit. `classType` stays
  // Algolia-driven since it scopes the session/group searches above.
  const heroTitle = rockTitle || classHit?.classType || '';
  const heroSummary = rockSummary;
  const heroCoverImageUri = rockCoverImageUri;

  return {
    // Include the browser search credentials so hydrated filter changes can go
    // straight to Algolia without revalidating this route loader.
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    classUrl,
    classHit,
    upcomingHits,
    groupHits,
    discussionGuideUrl,
    classTrailer,
    onDemandUrl,
    heroTitle,
    heroSummary,
    heroCoverImageUri,
  };
}
