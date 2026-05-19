import type { LoaderFunctionArgs } from 'react-router';

import { algoliasearch } from 'algoliasearch';

import { AuthenticationError } from '~/lib/.server/error-types';
import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import type { RockContentChannelItem } from '~/lib/types/rock-types';
import type { GroupType } from '~/routes/group-finder/types';

import type { ClassHitType } from '../types';
import {
  buildClassSingleGroupsSearchParams,
  buildClassSingleHeroSearchParams,
  buildClassSingleUpcomingSearchParams,
  CLASS_SINGLE_UPCOMING_FACET_ATTRIBUTES,
} from './components/build-class-single-algolia-search';
import { parseClassSingleUrlState } from './class-single-url-state';

export type ClassSingleFacetItem = {
  value: string;
  label: string;
  count: number;
};

export type LoaderReturnType = {
  classUrl: string;
  classHit: ClassHitType | null;
  upcomingHits: ClassHitType[];
  upcomingFacets: Record<string, ClassSingleFacetItem[]>;
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

function mapFacetRecord(
  facets: Record<string, Record<string, number>> | undefined,
): Record<string, ClassSingleFacetItem[]> {
  const out: Record<string, ClassSingleFacetItem[]> = {};
  if (!facets) return out;
  for (const attr of CLASS_SINGLE_UPCOMING_FACET_ATTRIBUTES) {
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
 * Server-only Algolia for class-single:
 * 1. Hero class by URL path (`pathName`)
 * 2. Upcoming sessions for that class type + filter URL (incl. lat/lng)
 * 3. Related groups mirroring the same refinements/geo
 *
 * Credentials stay on the server; filter widgets use a loader-backed SearchClient.
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
  let upcomingFacets: Record<string, ClassSingleFacetItem[]> = {};
  let groupHits: GroupType[] = [];

  const url = new URL(request.url);
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
            searchParams: {
              ...upcomingParams,
              facets: [...CLASS_SINGLE_UPCOMING_FACET_ATTRIBUTES],
              maxValuesPerFacet: 50,
            },
          }),
          client.searchSingleIndex({
            indexName: groupsIndex,
            searchParams: groupsParams,
          }),
        ]);

        upcomingHits = (upcomingRes.hits ?? []).map(
          (h) => h as unknown as ClassHitType,
        );
        upcomingFacets = mapFacetRecord(
          upcomingRes.facets as
            | Record<string, Record<string, number>>
            | undefined,
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
    classUrl,
    classHit,
    upcomingHits,
    upcomingFacets,
    groupHits,
    discussionGuideUrl,
    classTrailer,
    onDemandUrl,
  };
}
