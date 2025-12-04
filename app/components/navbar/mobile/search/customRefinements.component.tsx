import { useRefinementList, useInstantSearch } from "react-instantsearch";
import { useRef } from "react";

export const MobileSearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  const { items, refine } = useRefinementList({ attribute });
  const { indexUiState } = useInstantSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get currently selected items from the index state
  const selectedItems =
    (indexUiState?.refinementList?.[attribute] as string[]) || [];

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

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-scroll max-w-screen pr-8 pb-2 scrollbar-hide"
    >
      {items.map((item, index) => {
        const isSelected = selectedItems.includes(item.value);
        const label =
          item.label === "Ministry Page"
            ? "Ministry"
            : item.label === "Page Builder"
            ? "Resources"
            : item.label;

        return (
          <button
            key={item.value}
            onClick={() => handleItemClick(item.value)}
            className={`flex items-center justify-center text-center text-sm font-bold px-4 py-1 whitespace-nowrap transition-all duration-300 ${
              index === 0 ? "ml-4" : ""
            } ${
              isSelected
                ? "text-white bg-navy rounded-[55px]"
                : "text-[#7B7382]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
