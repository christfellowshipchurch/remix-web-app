import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInstantSearch } from 'react-instantsearch';
import {
  GroupFinderUrlState,
  parseGroupFinderUrlState,
} from '../group-finder-url-state';
import { GROUPS_ALGOLIA_INDEX_NAME } from '../types';

import { buildIndexInitialUiState } from '~/components/finders/finder-algolia.utils';

/** InstantSearch `initialUiState` slice for group finder filter widgets. */
export function buildGroupFinderInstantSearchUiState(
  urlState: GroupFinderUrlState,
): Record<string, Record<string, unknown>> {
  const indexSlice: Record<string, unknown> = {};
  const base = buildIndexInitialUiState(GROUPS_ALGOLIA_INDEX_NAME, {
    query: urlState.query,
    refinementList: urlState.refinementList,
  });
  const baseIndex = base?.[GROUPS_ALGOLIA_INDEX_NAME];
  if (baseIndex) {
    Object.assign(indexSlice, baseIndex);
  }
  if (urlState.page != null && urlState.page > 0) {
    indexSlice.page = urlState.page;
  }

  return Object.keys(indexSlice).length > 0
    ? { [GROUPS_ALGOLIA_INDEX_NAME]: indexSlice }
    : {};
}

/**
 * Keeps InstantSearch filter widgets aligned with URL after loader navigation (back/forward, Clear All).
 */
export function GroupFinderInstantSearchSync() {
  const [searchParams] = useSearchParams();
  const { setUiState } = useInstantSearch();

  useEffect(() => {
    const urlState = parseGroupFinderUrlState(searchParams);
    const nextUiState = buildGroupFinderInstantSearchUiState(urlState);
    const indexSlice = nextUiState[GROUPS_ALGOLIA_INDEX_NAME] ?? {};

    setUiState((prev) => {
      const prevRecord = prev as Record<string, Record<string, unknown>>;
      const prevIndex = prevRecord[GROUPS_ALGOLIA_INDEX_NAME] ?? {};
      const nextQuery = (indexSlice.query as string) ?? '';
      const prevQuery = (prevIndex.query as string) ?? '';
      const nextRl = JSON.stringify(indexSlice.refinementList ?? {});
      const prevRl = JSON.stringify(prevIndex.refinementList ?? {});
      const nextPage = (indexSlice.page as number) ?? 0;
      const prevPage = (prevIndex.page as number) ?? 0;

      if (
        nextQuery === prevQuery &&
        nextRl === prevRl &&
        nextPage === prevPage
      ) {
        return prev;
      }

      return {
        ...prevRecord,
        [GROUPS_ALGOLIA_INDEX_NAME]: {
          ...prevIndex,
          ...indexSlice,
        },
      };
    });
  }, [searchParams, setUiState]);

  return null;
}
