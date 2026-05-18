import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';

import { GROUPS_ALGOLIA_INDEX_NAME } from '../types';
import type { GroupFinderUrlState } from '../group-finder-url-state';

export const GROUP_FINDER_LOADER_HITS_PER_PAGE = 12;

export const GROUP_FINDER_FACET_ATTRIBUTES = [
  'meetingType',
  'campusName',
  'groupFor',
  'peopleWhoAre',
  'topics',
  'meetingDay',
  'meetingFrequency',
  'adultsOnly',
  'language',
] as const;

function refinementListToFacetFilters(
  refinementList: Record<string, string[]> | undefined,
): string[][] | undefined {
  if (!refinementList || Object.keys(refinementList).length === 0) {
    return undefined;
  }
  const groups: string[][] = [];
  for (const [attr, values] of Object.entries(refinementList)) {
    if (!values?.length) {
      continue;
    }
    groups.push(values.map((v) => `${attr}:"${escapeAlgoliaFilterString(v)}"`));
  }
  return groups.length > 0 ? groups : undefined;
}

function buildAgeNumericFilter(
  ageInput: string | undefined,
): string | undefined {
  const trimmed = ageInput?.trim() ?? '';
  if (trimmed.length < 2) {
    return undefined;
  }
  const userAge = parseInt(trimmed, 10);
  if (Number.isNaN(userAge) || userAge < 1) {
    return undefined;
  }
  return `minAge <= ${userAge} AND maxAge >= ${userAge}`;
}

/** Maps parsed URL state to Algolia `searchParams` for the route loader (server-side only). */
export function buildGroupFinderAlgoliaSearchParams(
  urlState: GroupFinderUrlState,
): {
  indexName: string;
  filters?: string;
  hitsPerPage: number;
  page: number;
  query?: string;
  facetFilters?: string[][];
  aroundLatLng?: string;
  aroundRadius?: 'all';
  aroundLatLngViaIP?: boolean;
  getRankingInfo?: boolean;
} {
  const params: {
    indexName: string;
    filters?: string;
    hitsPerPage: number;
    page: number;
    query?: string;
    facetFilters?: string[][];
    aroundLatLng?: string;
    aroundRadius?: 'all';
    aroundLatLngViaIP?: boolean;
    getRankingInfo?: boolean;
  } = {
    indexName: GROUPS_ALGOLIA_INDEX_NAME,
    hitsPerPage: GROUP_FINDER_LOADER_HITS_PER_PAGE,
    page: urlState.page ?? 0,
    aroundLatLngViaIP: false,
    getRankingInfo: true,
  };

  const ageFilter = buildAgeNumericFilter(urlState.age);
  if (ageFilter) {
    params.filters = ageFilter;
  }

  const q = urlState.query?.trim();
  if (q) {
    params.query = q;
  }

  const facetFilters = refinementListToFacetFilters(urlState.refinementList);
  if (facetFilters) {
    params.facetFilters = facetFilters;
  }

  if (
    urlState.lat != null &&
    urlState.lng != null &&
    !Number.isNaN(urlState.lat) &&
    !Number.isNaN(urlState.lng)
  ) {
    params.aroundLatLng = `${urlState.lat}, ${urlState.lng}`;
    params.aroundRadius = 'all';
    params.getRankingInfo = true;
  }

  return params;
}
