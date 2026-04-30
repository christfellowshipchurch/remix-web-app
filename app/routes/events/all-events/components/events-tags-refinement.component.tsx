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
    <div className="-ml-5 flex w-screen flex-nowrap gap-6 overflow-x-auto scrollbar-hide px-1 pb-4 md:ml-0 md:w-full">
      <button
        type="button"
        onClick={() => handleCategoryClick(null)}
        className={`ml-4 flex shrink-0 cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm whitespace-nowrap transition-colors duration-300 md:ml-0 ${
          selectedCategory === null
            ? "bg-ocean/10 text-ocean hover:bg-gray"
            : "bg-gray font-semibold text-neutral-darker hover:bg-ocean/10 hover:text-ocean"
        }`}
      >
        Upcoming
      </button>

      {items.map((item) => {
        const isSelected = selectedCategory === item.value;
        const pillBase =
          "inline-flex shrink-0 items-center rounded-full text-sm whitespace-nowrap transition-colors duration-300";
        const selectedStyles = "bg-ocean/10 text-ocean hover:bg-gray";
        const idleStyles =
          "bg-gray font-semibold text-neutral-darker hover:bg-ocean/10 hover:text-ocean";

        if (isSelected) {
          const label = startCase(item.label);
          return (
            <div
              key={item.value}
              className={`${pillBase} cursor-default ${selectedStyles}`}
            >
              <button
                type="button"
                onClick={() => handleCategoryClick(item.value)}
                className="cursor-pointer py-3 pl-6 pr-2 text-sm"
              >
                {label}
              </button>
              <button
                type="button"
                onClick={() => handleCategoryClick(null)}
                aria-label={`Clear ${label} filter`}
                className="flex cursor-pointer items-center py-3 pr-5 pl-1"
              >
                <Icon name="x" size={18} className="shrink-0" />
              </button>
            </div>
          );
        }

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => handleCategoryClick(item.value)}
            className={`${pillBase} cursor-pointer px-6 py-3 ${idleStyles}`}
          >
            {startCase(item.label)}
          </button>
        );
      })}
    </div>
  );
};
