import { useInstantSearch } from "react-instantsearch";

import { cn } from "~/lib/utils";
import { hasInstantSearchIndexUiActiveFilters } from "~/lib/algolia-active-filters";

interface AlgoliaFinderClearAllButtonProps {
  /** See .github/ALGOLIA-URL-STATE-REUSABILITY.md — Pattern A step 5 or Pattern B step 4. */
  onClearAllToUrl: () => void;
  className?: string;
  /**
   * True when filters exist outside InstantSearch uiState (e.g. group finder campus/age/geo).
   * Default: only query + refinementList are considered.
   */
  additionalFiltersActive?: boolean;
}

export const AlgoliaFinderClearAllButton = ({
  onClearAllToUrl,
  className,
  additionalFiltersActive = false,
}: AlgoliaFinderClearAllButtonProps) => {
  const { setIndexUiState, indexUiState } = useInstantSearch();

  const hasInstantFilters = hasInstantSearchIndexUiActiveFilters(indexUiState);
  const canClear = hasInstantFilters || additionalFiltersActive;

  const handleClearAll = () => {
    if (!canClear) return;
    onClearAllToUrl();
    setIndexUiState((state) => ({
      ...state,
      query: "",
      refinementList: {},
      page: 0,
    }));
  };

  return (
    <button
      type="button"
      disabled={!canClear}
      onClick={handleClearAll}
      className={cn(
        "shrink-0 font-semibold text-base transition-colors duration-300",
        canClear
          ? "cursor-pointer text-ocean hover:text-navy"
          : "cursor-not-allowed text-neutral-400 opacity-60",
        className,
      )}
    >
      Clear All
    </button>
  );
};
