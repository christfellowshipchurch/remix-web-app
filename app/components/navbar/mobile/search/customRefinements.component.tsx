import { useRefinementList, useInstantSearch } from "react-instantsearch";
import { useRef } from "react";

export const MobileSearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  const { items, refine } = useRefinementList({ attribute });
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get currently selected items from the index state
  const selectedItems =
    (indexUiState?.refinementList?.[attribute] as string[]) || [];

  // Check if either "Ministry Page" or "Page Builder" is selected
  const isPagesSelected =
    selectedItems.includes("Ministry Page") ||
    selectedItems.includes("Page Builder");

  // Filter out "Ministry Page", "Page Builder", and "Redirect Card" from regular items
  const filteredItems = items.filter(
    (item) =>
      item.value !== "Ministry Page" &&
      item.value !== "Page Builder" &&
      item.value !== "Redirect Card"
  );

  const handleItemClick = (value: string) => {
    refine(value);

    // Scroll to the start after a short delay
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handlePagesClick = () => {
    const currentSelected = selectedItems.filter(
      (item) => item !== "Ministry Page" && item !== "Page Builder"
    );

    if (isPagesSelected) {
      // Deselect both "Ministry Page" and "Page Builder"
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [attribute]: currentSelected,
        },
      }));
    } else {
      // Select both "Ministry Page" and "Page Builder"
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [attribute]: [...currentSelected, "Ministry Page", "Page Builder"],
        },
      }));
    }

    // Scroll to the start after a short delay
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-scroll max-w-screen pr-8 pb-2 scrollbar-hide"
    >
      {/* Custom "Pages" button combining Ministry Page and Page Builder */}
      <button
        onClick={handlePagesClick}
        className={`flex items-center justify-center text-center text-sm font-bold px-4 py-1 whitespace-nowrap transition-all duration-300 ml-4 ${
          isPagesSelected
            ? "text-white bg-navy rounded-[55px]"
            : "text-[#7B7382]"
        }`}
      >
        Pages
      </button>

      {/* Other refinement items */}
      {filteredItems.map((item) => {
        const isSelected = selectedItems.includes(item.value);

        return (
          <button
            key={item.value}
            onClick={() => handleItemClick(item.value)}
            className={`flex items-center justify-center text-center text-sm font-bold px-4 py-1 whitespace-nowrap transition-all duration-300 ${
              isSelected
                ? "text-white bg-navy rounded-[55px]"
                : "text-[#7B7382]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
