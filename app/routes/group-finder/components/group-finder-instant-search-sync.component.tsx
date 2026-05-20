import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInstantSearch } from 'react-instantsearch';
import {
  GroupFinderUrlState,
  parseGroupFinderUrlState,
} from '../group-finder-url-state';
import { GROUPS_ALGOLIA_INDEX_NAME } from '../types';

import { buildIndexInitialUiState } from '~/components/finders/finder-algolia.utils';

/**
 * Builds the InstantSearch index slice from URL state.
 * Shared by `initialUiState` on mount and by {@link GroupFinderInstantSearchSync} after navigation.
 */
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
 * Reconciles InstantSearch uiState when the URL changes without remounting InstantSearch.
 *
 * Filter changes flow: widget → `onStateChange` → URL → loader → new `searchParams`.
 * That path does not always round-trip through InstantSearch, so this effect copies
 * URL → uiState (back/forward, Clear All, direct link with query string).
 * Skips `setUiState` when values are unchanged to avoid extra search cycles.
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

      const nextIndex = { ...prevIndex };
      if (nextQuery) {
        nextIndex.query = nextQuery;
      } else {
        delete nextIndex.query;
      }
      if (indexSlice.refinementList) {
        nextIndex.refinementList = indexSlice.refinementList;
      } else {
        delete nextIndex.refinementList;
      }
      if (nextPage > 0) {
        nextIndex.page = nextPage;
      } else {
        delete nextIndex.page;
      }

      return {
        ...prevRecord,
        [GROUPS_ALGOLIA_INDEX_NAME]: nextIndex,
      };
    });
  }, [searchParams, setUiState]);

  return null;
}
