import { useState, useEffect } from "react";
import { useInstantSearch, useRefinementList } from "react-instantsearch";
import startCase from "lodash/startCase";
import Icon from "~/primitives/icon";

/** Main events index. No replica; "Recent" order is done via client-side sort. */
export const EVENTS_INDEX = "dev_contentItems";

export const EventsTagsRefinementList = () => {
  const { items } = useRefinementList({ attribute: "eventCategories" });
  const { setIndexUiState, indexUiState } = useInstantSearch();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync local state with Algolia search state
  useEffect(() => {
    const eventCategories = indexUiState?.refinementList?.eventCategories || [];
    if (eventCategories.length === 0) {
      setSelectedCategory(null);
    } else if (eventCategories.length === 1) {
      setSelectedCategory(eventCategories[0]);
    }
  }, [indexUiState?.refinementList?.eventCategories]);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {
        ...prevState.refinementList,
        eventCategories: category === null ? [] : [category],
      },
      page: 0,
    }));
  };

  return (
    <div className="-ml-5 md:ml-0 w-screen md:w-full flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide">
      {/* Recent */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={`ml-4 md:ml-0 text-lg shrink-0 px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap cursor-pointer transition-colors duration-300 ${
          selectedCategory === null
            ? "border border-neutral-600 text-neutral-600 bg-white font-semibold"
            : "bg-gray text-neutral-500 hover:bg-neutral-200"
        }`}
      >
        Recent
      </button>

      {/* Event categories */}
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => handleCategoryClick(item.value)}
          className={`text-lg shrink-0 px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap cursor-pointer transition-colors duration-300 ${
            selectedCategory === item.value
              ? "border border-neutral-600 text-neutral-600 bg-white font-semibold"
              : "bg-gray text-neutral-500 hover:bg-neutral-200"
          }`}
        >
          {startCase(item.label)}
        </button>
      ))}
    </div>
  );
};

export const EventsClearFiltersText = () => {
  const { setIndexUiState } = useInstantSearch();

  return (
    <div
      className="flex items-center gap-1 group cursor-pointer"
      onClick={() => {
        setIndexUiState((state) => ({
          ...state,
          refinementList: {},
        }));
      }}
    >
      <p className="w-fit text-ocean underline group-hover:text-navy transition-colors duration-300">
        Clear <span className="hidden md:inline">All Filters</span>
      </p>
      <Icon
        name="x"
        className="text-ocean group-hover:text-navy transition-colors duration-300"
      />
    </div>
  );
};
