import { useEffect, useRef } from "react";

function MobileTimelineNavigation({
  timelineData,
  activeTab,
  handleTabChange,
}: {
  timelineData: {
    year: string;
  }[];
  activeTab: number;
  handleTabChange: (index: number) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeButton = container.children[activeTab] as HTMLElement;

      if (activeButton) {
        const containerWidth = container.offsetWidth;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.offsetWidth;
        const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="my-6 md:hidden">
      <div
        ref={scrollContainerRef}
        className="flex items-center justify-center flex-wrap gap-[6px] px-4 sm:gap-[10px]"
      >
        {timelineData.map((item, index) => (
          <button
            key={item.year}
            onClick={() => handleTabChange(index)}
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-full font-bold text-sm transition-all duration-300 flex-shrink-0 snap-center whitespace-nowrap ${
              activeTab === index
                ? "bg-ocean text-white"
                : "bg-gray-200 text-text-secondary hover:bg-gray-300"
            }`}
          >
            {item.year}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MobileTimelineNavigation;
