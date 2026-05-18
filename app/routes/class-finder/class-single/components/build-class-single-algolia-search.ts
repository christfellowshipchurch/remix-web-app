import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';
import { GROUPS_ALGOLIA_INDEX_NAME } from '~/routes/group-finder/types';

import type { ClassSingleUrlState } from '../class-single-url-state';
import { coordinatesFromClassSingleUrlState } from '../class-single-url-state';

export const CLASSES_ALGOLIA_INDEX_NAME = 'dev_Classes' as const;

/** Enough hits for carousel slides + geo/virtual ordering (matches client `Configure`). */
export const CLASS_SINGLE_UPCOMING_MAX_HITS = 1000;

export const CLASS_SINGLE_UPCOMING_FACET_ATTRIBUTES = [
  'campus',
  'format',
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
    if (!values?.length) continue;
    groups.push(values.map((v) => `${attr}:"${escapeAlgoliaFilterString(v)}"`));
  }
  return groups.length > 0 ? groups : undefined;
}

/** Loads the hero class record for `/class-finder/:path`. */
export function buildClassSingleHeroSearchParams(classUrl: string): {
  indexName: typeof CLASSES_ALGOLIA_INDEX_NAME;
  hitsPerPage: number;
  filters: string;
} {
  return {
    indexName: CLASSES_ALGOLIA_INDEX_NAME,
    hitsPerPage: 1,
    filters: `pathName:"${escapeAlgoliaFilterString(classUrl)}"`,
  };
}

/** Upcoming sessions on `dev_Classes` for the current class type + URL filters/geo. */
export function buildClassSingleUpcomingSearchParams(
  urlState: ClassSingleUrlState,
  classesIndexClassType: string,
): {
  indexName: typeof CLASSES_ALGOLIA_INDEX_NAME;
  hitsPerPage: number;
  filters?: string;
  query?: string;
  facetFilters?: string[][];
  aroundLatLng?: string;
  aroundRadius?: 'all';
  aroundLatLngViaIP?: boolean;
  getRankingInfo?: boolean;
} {
  const trimmed = classesIndexClassType.trim();
  const params: ReturnType<typeof buildClassSingleUpcomingSearchParams> = {
    indexName: CLASSES_ALGOLIA_INDEX_NAME,
    hitsPerPage: CLASS_SINGLE_UPCOMING_MAX_HITS,
    aroundLatLngViaIP: false,
    getRankingInfo: true,
  };

  if (trimmed) {
    params.filters = `classType:"${escapeAlgoliaFilterString(trimmed)}"`;
  }

  const q = urlState.query?.trim();
  if (q) params.query = q;

  const facetFilters = refinementListToFacetFilters(urlState.refinementList);
  if (facetFilters) params.facetFilters = facetFilters;

  const coords = coordinatesFromClassSingleUrlState(urlState);
  if (coords) {
    params.aroundLatLng = `${coords.lat}, ${coords.lng}`;
    params.aroundRadius = 'all';
    params.getRankingInfo = true;
  }

  return params;
}

/** Maps `dev_Classes` session refinements to `dev_Groups` filter string. */
export function mirrorGroupsFacetsFromClassRefinements(
  refinementList: Record<string, string[]>,
): string | undefined {
  const parts: string[] = [];

  const campuses = (refinementList.campus ?? []).filter(
    (v) => v != null && String(v).trim() !== '',
  );
  if (campuses.length === 1) {
    parts.push(`campusName:"${escapeAlgoliaFilterString(campuses[0])}"`);
  } else if (campuses.length > 1) {
    parts.push(
      `(${campuses.map((c) => `campusName:"${escapeAlgoliaFilterString(c)}"`).join(' OR ')})`,
    );
  }

  const formats = (refinementList.format ?? []).filter(
    (v) => v != null && String(v).trim() !== '',
  );
  const meetingTypes = [
    ...new Set(
      formats
        .map((f) => classFormatToGroupMeetingType(f))
        .filter((m): m is string => m != null),
    ),
  ];
  if (meetingTypes.length === 1) {
    parts.push(`meetingType:"${escapeAlgoliaFilterString(meetingTypes[0])}"`);
  } else if (meetingTypes.length > 1) {
    parts.push(
      `(${meetingTypes.map((m) => `meetingType:"${escapeAlgoliaFilterString(m)}"`).join(' OR ')})`,
    );
  }

  const languages = (refinementList.language ?? []).filter(
    (v) => v != null && String(v).trim() !== '',
  );
  const groupLanguages = [
    ...new Set(
      languages
        .map((l) => classLanguageToGroupLanguage(l))
        .filter((l): l is string => l != null),
    ),
  ];
  if (groupLanguages.length === 1) {
    parts.push(`language:"${escapeAlgoliaFilterString(groupLanguages[0])}"`);
  } else if (groupLanguages.length > 1) {
    parts.push(
      `(${groupLanguages.map((l) => `language:"${escapeAlgoliaFilterString(l)}"`).join(' OR ')})`,
    );
  }

  if (parts.length === 0) return undefined;
  return parts.join(' AND ');
}

function classFormatToGroupMeetingType(format: string): string | null {
  if (format === 'Virtual') return 'Virtual';
  if (format === 'In-Person') return 'In Person';
  return null;
}

function classLanguageToGroupLanguage(lang: string): string | null {
  if (lang === 'English') return 'English';
  if (lang === 'Español' || lang === 'Spanish') return 'Spanish';
  return null;
}

function composeGroupsFilters(
  classesIndexClassType: string,
  mirroredFacetFilters: string | undefined,
): string | undefined {
  const trimmed = classesIndexClassType.trim();
  const classTypeFilter = trimmed
    ? `classType:"${escapeAlgoliaFilterString(trimmed)}"`
    : null;
  if (classTypeFilter && mirroredFacetFilters) {
    return `${classTypeFilter} AND ${mirroredFacetFilters}`;
  }
  if (classTypeFilter) return classTypeFilter;
  return mirroredFacetFilters;
}

/** Related groups carousel on `dev_Groups`, mirroring session URL refinements. */
export function buildClassSingleGroupsSearchParams(
  urlState: ClassSingleUrlState,
  classesIndexClassType: string,
): {
  indexName: typeof GROUPS_ALGOLIA_INDEX_NAME;
  hitsPerPage: number;
  query: string;
  filters?: string;
  aroundLatLng?: string;
  aroundRadius?: 'all';
  aroundLatLngViaIP?: boolean;
  getRankingInfo?: boolean;
} {
  const mirrored = mirrorGroupsFacetsFromClassRefinements(
    urlState.refinementList ?? {},
  );
  const params: ReturnType<typeof buildClassSingleGroupsSearchParams> = {
    indexName: GROUPS_ALGOLIA_INDEX_NAME,
    hitsPerPage: CLASS_SINGLE_UPCOMING_MAX_HITS,
    query: '',
    aroundLatLngViaIP: false,
  };

  const filters = composeGroupsFilters(classesIndexClassType, mirrored);
  if (filters) params.filters = filters;

  const coords = coordinatesFromClassSingleUrlState(urlState);
  if (coords) {
    params.aroundLatLng = `${coords.lat}, ${coords.lng}`;
    params.aroundRadius = 'all';
    params.getRankingInfo = true;
  }

  return params;
}
