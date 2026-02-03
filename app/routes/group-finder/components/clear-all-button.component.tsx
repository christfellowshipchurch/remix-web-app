import { useInstantSearch } from "react-instantsearch";

interface GroupFinderClearAllButtonProps {
  /** Called after clearing InstantSearch state; parent clears URL, custom state, and bumps InstantSearch key. */
  onClearAllToUrl: () => void;
}

export const GroupFinderClearAllButton = ({
  onClearAllToUrl,
}: GroupFinderClearAllButtonProps) => {
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
      className="cursor-pointer text-text-secondary hover:text-ocean transition-colors duration-300 font-semibold text-base shrink-0"
    >
      Clear All
    </button>
  );
};
