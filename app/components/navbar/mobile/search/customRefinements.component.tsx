import { RefinementList } from "react-instantsearch";
import { useRef, useEffect } from "react";

export const MobileSearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (event: Event) => {
      // Check if the click was on a refinement item
      const target = event.target as HTMLElement;
      if (
        target.closest('[data-testid="refinement-list-item"]') ||
        target.closest(".ais-RefinementList-item")
      ) {
        // Scroll to the start after a short delay
        setTimeout(() => {
          const scrollContainer = container.querySelector(
            ".ais-RefinementList-list"
          ) as HTMLElement;
          if (scrollContainer) {
            scrollContainer.scrollTo({
              left: 0,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={containerRef}>
      <RefinementList
        classNames={{
          list: "flex gap-2 overflow-x-scroll max-w-screen pr-8 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          checkbox: "hidden",
          count: "hidden",
          item: "first:ml-4 flex items-center justify-center text-center text-sm font-bold text-[#7B7382] px-4 py-1 whitespace-nowrap transition-all duration-300",
          selectedItem:
            "flex items-center justify-center text-center text-sm font-bold text-white px-4 py-1 whitespace-nowrap  bg-navy rounded-[55px] transition-all duration-300",
          label:
            "flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer",
        }}
        attribute={attribute}
      />
    </div>
  );
};
