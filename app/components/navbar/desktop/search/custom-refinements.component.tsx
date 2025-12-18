import { useRefinementList, useInstantSearch } from "react-instantsearch";

export const SearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  const { items, refine } = useRefinementList({ attribute });
  const { indexUiState, setIndexUiState } = useInstantSearch();

  // Get currently selected items from the index state
  const selectedItems =
    (indexUiState?.refinementList?.[attribute] as string[]) || [];

  // Check if "Ministry Page", "Page Builder", or "Redirect Card" is selected
  const isPagesSelected =
    selectedItems.includes("Ministry Page") ||
    selectedItems.includes("Page Builder") ||
    selectedItems.includes("Redirect Card");

  // Filter out "Ministry Page", "Page Builder", and "Redirect Card" from regular items
  const filteredItems = items.filter(
    (item) =>
      item.value !== "Ministry Page" &&
      item.value !== "Page Builder" &&
      item.value !== "Redirect Card"
  );

  const handleItemClick = (value: string) => {
    refine(value);
  };

  const handlePagesClick = () => {
    const currentSelected = selectedItems.filter(
      (item) =>
        item !== "Ministry Page" &&
        item !== "Page Builder" &&
        item !== "Redirect Card"
    );

    if (isPagesSelected) {
      // Deselect "Ministry Page", "Page Builder", and "Redirect Card"
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [attribute]: currentSelected,
        },
      }));
    } else {
      // Select "Ministry Page", "Page Builder", and "Redirect Card"
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [attribute]: [
            ...currentSelected,
            "Ministry Page",
            "Page Builder",
            "Redirect Card",
          ],
        },
      }));
    }
  };

  const buttonClass =
    "flex items-center justify-center text-center text-xs border-[0.7px] px-4 py-2 max-h-[36px] whitespace-nowrap rounded-md transition-all duration-300";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Custom "Pages" button combining Ministry Page and Page Builder */}
      <div
        className={`${buttonClass} ${
          isPagesSelected
            ? "text-ocean border-ocean overflow-hidden group pr-3 hover:-translate-y-1"
            : "border-[#AAAAAA] text-[#444444] hover:text-ocean hover:border-ocean"
        }`}
      >
        <button
          onClick={handlePagesClick}
          className={`flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer ${
            isPagesSelected
              ? "pr-5 bg-[url('/assets/icons/xmark-solid.svg')] bg-[length:16px_16px] bg-[center_right_0px] bg-no-repeat"
              : ""
          }`}
        >
          Pages
        </button>
      </div>

      {/* Other refinement items */}
      {filteredItems.map((item) => {
        const isSelected = selectedItems.includes(item.value);

        return (
          <div
            key={item.value}
            className={`${buttonClass} ${
              isSelected
                ? "text-ocean border-ocean overflow-hidden group pr-3 hover:-translate-y-1"
                : "border-[#AAAAAA] text-[#444444] hover:text-ocean hover:border-ocean"
            }`}
          >
            <button
              onClick={() => handleItemClick(item.value)}
              className={`flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer ${
                isSelected
                  ? "pr-5 bg-[url('/assets/icons/xmark-solid.svg')] bg-[length:16px_16px] bg-[center_right_0px] bg-no-repeat"
                  : ""
              }`}
            >
              {item.label}
            </button>
          </div>
        );
      })}
    </div>
  );
};
