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
  return (
    <div className='my-6 md:hidden'>
      <div className='flex items-stretch gap-1 sm:gap-[6px]'>
        {timelineData.map((item, index) => (
          <button
            key={item.year}
            onClick={() => handleTabChange(index)}
            className={`min-w-0 flex-1 px-1 py-2 sm:px-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-center transition-all duration-300 whitespace-nowrap ${
              activeTab === index
                ? 'bg-ocean text-white'
                : 'border-2 border-neutral-lightest text-text-secondary hover:bg-gray-100'
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
