function TimelineNavigation({
  timelineData,
  activeTab,
  handleTabChange,
  className,
}: {
  timelineData: { year: string }[];
  activeTab: number;
  handleTabChange: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={`relative mb-12 ${className}`}>
      <div className="flex justify-between items-center xl:px-12">
        {timelineData.map((item, index) => (
          <button
            key={item.year}
            onClick={() => handleTabChange(index)}
            className="flex flex-col items-center space-y-2 relative cursor-pointer px-4 select-none"
          >
            <span
              className={`text-lg font-bold transition-colors duration-300 ${
                activeTab === index ? "text-text-primary" : "text-neutral-light"
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
