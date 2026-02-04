import { useInstantSearch } from "react-instantsearch";
import { cn } from "~/lib/utils";

interface AlgoliaFinderClearAllButtonProps {
  /** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 5 or Pattern B step 4. */
  onClearAllToUrl: () => void;
  className?: string;
}

export const AlgoliaFinderClearAllButton = ({
  onClearAllToUrl,
  className,
}: AlgoliaFinderClearAllButtonProps) => {
  const { setIndexUiState } = useInstantSearch();

  const handleClearAll = () => {
    setIndexUiState((state) => ({
      ...state,
      query: "",
      refinementList: {},
      page: 0,
    }));
    onClearAllToUrl();
  };

  return (
    <button
      type="button"
      onClick={handleClearAll}
      className={cn(
        "cursor-pointer text-text-secondary hover:text-ocean transition-colors duration-300 font-semibold text-base shrink-0",
        className
      )}
    >
      Clear All
    </button>
  );
};
