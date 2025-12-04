import { useRefinementList, useInstantSearch } from "react-instantsearch";

export const SearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  const { items, refine } = useRefinementList({ attribute });
  const { indexUiState } = useInstantSearch();

  // Get currently selected items from the index state
  const selectedItems =
    (indexUiState?.refinementList?.[attribute] as string[]) || [];

  const handleItemClick = (value: string) => {
    refine(value);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isSelected = selectedItems.includes(item.value);
        const label =
          item.label === "Ministry Page"
            ? "Ministry"
            : item.label === "Page Builder"
            ? "Resources"
            : item.label;

        return (
          <div
            key={item.value}
            className={`flex items-center justify-center text-center text-xs border-[0.7px] px-4 py-2 whitespace-nowrap rounded-md transition-all duration-300 ${
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
              {label}
            </button>
          </div>
        );
      })}
    </div>
  );
};
