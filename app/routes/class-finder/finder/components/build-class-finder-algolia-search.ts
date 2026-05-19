import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';

import type { ClassFinderUrlState } from './class-finder-url-state';

export const CLASSES_ALGOLIA_INDEX_NAME = 'dev_Classes' as const;

/** Matches previous client `hitsPerPageOverride={1000}` — grouping runs server-side in the loader response. */
export const CLASS_FINDER_LOADER_HITS_PER_PAGE = 1000;

export const CLASS_FINDER_FACET_ATTRIBUTES = [
  'campus',
  'topic',
  'language',
  'format',
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

/** Maps URL state → Algolia params for the class finder route loader (server only). */
export function buildClassFinderAlgoliaSearchParams(
  urlState: ClassFinderUrlState,
): {
  indexName: string;
  hitsPerPage: number;
  page: number;
  query?: string;
  facetFilters?: string[][];
} {
  const params: {
    indexName: string;
    hitsPerPage: number;
    page: number;
    query?: string;
    facetFilters?: string[][];
  } = {
    indexName: CLASSES_ALGOLIA_INDEX_NAME,
    hitsPerPage: CLASS_FINDER_LOADER_HITS_PER_PAGE,
    page: 0,
  };

  const q = urlState.query?.trim();
  if (q) {
    params.query = q;
  }

  const facetFilters = refinementListToFacetFilters(urlState.refinementList);
  if (facetFilters) {
    params.facetFilters = facetFilters;
  }

  return params;
}
