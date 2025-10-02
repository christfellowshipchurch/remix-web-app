import { useEffect, useRef } from "react";

function TimelineNavigation({
  timelineData,
  activeTab,
  handleTabChange,
}: {
  timelineData: any[];
  activeTab: number;
  handleTabChange: (index: number) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const innerDiv = container.children[0] as HTMLElement;
      const activeButton = innerDiv.children[activeTab] as HTMLElement;

      if (activeButton && innerDiv) {
        // Only apply centering on mobile screens (below xl breakpoint)
        const isMobile = window.innerWidth < 1280; // xl breakpoint is 1280px

        if (isMobile) {
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
    }
  }, [activeTab]);
  return (
    <div className="relative mb-12">
      <div
        ref={scrollContainerRef}
        className="flex items-center xl:px-12 overflow-x-auto xl:overflow-x-visible scrollbar-hide snap-x snap-mandatory xl:snap-none"
      >
        <div className="flex justify-between items-center w-full min-w-[700px] xl:min-w-0 px-16 xl:px-0">
          {timelineData.map((item, index) => (
            <button
              key={item.year}
              onClick={() => handleTabChange(index)}
              className="flex flex-col items-center space-y-2 relative cursor-pointer px-4 select-none flex-shrink-0 snap-center xl:snap-none"
            >
              <span
                className={`text-lg font-bold transition-colors duration-300 ${
                  activeTab === index
                    ? "text-text-primary"
                    : "text-neutral-light"
                }`}
              >
                {item.year}
              </span>
              <div
                className={`w-4 h-4 rounded-full border-2 z-30 transition-colors duration-300 ${
                  activeTab === index
                    ? "bg-ocean border-ocean"
                    : "bg-gray-300 border-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      {/* Timeline Line with Fade Effects */}
      <div className="absolute top-[calc(50%+1rem)] left-0 right-0">
        <div className="h-0.5 bg-gray-200 relative">
          <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-gray to-transparent" />
          <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-gray to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default TimelineNavigation;
