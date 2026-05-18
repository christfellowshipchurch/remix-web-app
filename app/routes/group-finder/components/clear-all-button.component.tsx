import { useInstantSearch } from 'react-instantsearch';

import { cn } from '~/lib/utils';
import { hasInstantSearchIndexUiActiveFilters } from '~/lib/algolia-active-filters';

interface AlgoliaFinderClearAllButtonBaseProps {
  className?: string;
  /**
   * True when filters exist outside InstantSearch uiState (e.g. group finder campus/age/geo).
   * Default: only query + refinementList are considered.
   */
  additionalFiltersActive?: boolean;
}

type AlgoliaFinderClearAllButtonInstantSearchProps =
  AlgoliaFinderClearAllButtonBaseProps & {
    /**
     * Sync cleared state to the URL (e.g. `setSearchParams`).
     * Omit when `<InstantSearch routing={…}>` already persists UI state to the URL so you avoid a second navigation/search.
     * See .github/ALGOLIA-URL-STATE-REUSABILITY.md — Pattern A step 5 or Pattern B step 4.
     */
    onClearAllToUrl?: () => void;
    /** When set, skips InstantSearch — use for URL-only finders (no `<InstantSearch>` wrapper). */
    urlManaged?: false;
  };

type AlgoliaFinderClearAllButtonUrlManagedProps =
  AlgoliaFinderClearAllButtonBaseProps & {
    urlManaged: true;
    /** Whether the current URL has query, refinements, or page beyond defaults. */
    urlFiltersActive: boolean;
    onClearAllToUrl: () => void;
  };

export type AlgoliaFinderClearAllButtonProps =
  | AlgoliaFinderClearAllButtonInstantSearchProps
  | AlgoliaFinderClearAllButtonUrlManagedProps;

function AlgoliaFinderClearAllButtonUrlManaged({
  onClearAllToUrl,
  className,
  additionalFiltersActive = false,
  urlFiltersActive,
}: AlgoliaFinderClearAllButtonUrlManagedProps) {
  const canClear = urlFiltersActive || additionalFiltersActive;

  const handleClearAll = () => {
    if (!canClear) return;
    onClearAllToUrl();
  };

  return (
    <button
      type='button'
      disabled={!canClear}
      onClick={handleClearAll}
      className={cn(
        'shrink-0 font-semibold text-base transition-colors duration-300',
        canClear
          ? 'cursor-pointer text-ocean hover:text-navy'
          : 'cursor-not-allowed text-neutral-400 opacity-60',
        className,
      )}
    >
      Clear All
    </button>
  );
}

function AlgoliaFinderClearAllButtonInstantSearch({
  onClearAllToUrl,
  className,
  additionalFiltersActive = false,
}: AlgoliaFinderClearAllButtonInstantSearchProps) {
  const { setIndexUiState, indexUiState } = useInstantSearch();

  const hasInstantFilters = hasInstantSearchIndexUiActiveFilters(indexUiState);
  const canClear = hasInstantFilters || additionalFiltersActive;

  const handleClearAll = () => {
    if (!canClear) return;
    setIndexUiState((state) => ({
      ...state,
      query: '',
      refinementList: {},
      page: 0,
    }));
    onClearAllToUrl?.();
  };

  return (
    <button
      type='button'
      disabled={!canClear}
      onClick={handleClearAll}
      className={cn(
        'shrink-0 font-semibold text-base transition-colors duration-300',
        canClear
          ? 'cursor-pointer text-ocean hover:text-navy'
          : 'cursor-not-allowed text-neutral-400 opacity-60',
        className,
      )}
    >
      Clear All
    </button>
  );
}

export const AlgoliaFinderClearAllButton = (
  props: AlgoliaFinderClearAllButtonProps,
) => {
  if (props.urlManaged) {
    return <AlgoliaFinderClearAllButtonUrlManaged {...props} />;
  }
  return <AlgoliaFinderClearAllButtonInstantSearch {...props} />;
};
