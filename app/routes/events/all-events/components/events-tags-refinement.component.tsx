import { useState, useEffect } from "react";
import {
  useInstantSearch,
  useRefinementList,
  useSortBy,
} from "react-instantsearch";
import Icon from "~/primitives/icon";

/** Main events index (relevance). Replica for date sort must exist in Algolia. */
export const EVENTS_INDEX = "dev_daniel_contentItems";
/** Replica index sorted by firstDateOfEvent desc (chronological "Recent"). */
export const EVENTS_INDEX_SORT_BY_FIRST_DATE =
  "dev_daniel_contentItems_firstDateOfEvent_desc";

/**
 * TODO: Set to true once firstDateOfEvent is in Algolia and replica index
 * dev_daniel_contentItems_firstDateOfEvent_desc exists. When false, "Recent"
 * uses main index only (no date sort).
 */
export const USE_FIRST_DATE_OF_EVENT_SORT = false;

const SORT_BY_ITEMS = USE_FIRST_DATE_OF_EVENT_SORT
  ? [
      { value: EVENTS_INDEX_SORT_BY_FIRST_DATE, label: "By first date" },
      { value: EVENTS_INDEX, label: "Relevance" },
    ]
  : [{ value: EVENTS_INDEX, label: "Relevance" }];

export const EventsTagsRefinementList = () => {
  const { items } = useRefinementList({ attribute: "eventTags" });
  const { setIndexUiState, indexUiState } = useInstantSearch();
  const { refine: refineSortBy } = useSortBy({ items: SORT_BY_ITEMS });
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Sync local state with Algolia search state
  useEffect(() => {
    const eventTags = indexUiState?.refinementList?.eventTags || [];
    if (eventTags.length === 0) {
      setSelectedTag(null);
    } else if (eventTags.length === 1) {
      setSelectedTag(eventTags[0]);
    }
  }, [indexUiState?.refinementList?.eventTags]);

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);

    if (tag === null) {
      if (USE_FIRST_DATE_OF_EVENT_SORT) {
        refineSortBy(EVENTS_INDEX_SORT_BY_FIRST_DATE);
      }
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          eventTags: [],
        },
        page: 0, // Reset to first page
      }));
    } else {
      if (USE_FIRST_DATE_OF_EVENT_SORT) {
        refineSortBy(EVENTS_INDEX);
      }
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          eventTags: [tag],
        },
        page: 0, // Reset to first page
      }));
    }
  };

  return (
    <div className="-ml-5 md:ml-0 w-screen md:w-full flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide">
      {/* Recent Tag */}
      <button
        onClick={() => handleTagClick(null)}
        className={`ml-4 md:ml-0 text-lg shrink-0 px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap cursor-pointer transition-colors duration-300 ${
          selectedTag === null
            ? "border border-neutral-600 text-neutral-600 bg-white font-semibold"
            : "bg-gray text-neutral-500 hover:bg-neutral-200"
        }`}
      >
        Recent
      </button>

      {/* Dynamic Tags */}
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => handleTagClick(item.value)}
          className={`text-lg shrink-0 px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap cursor-pointer transition-colors duration-300 ${
            selectedTag === item.value
              ? "border border-neutral-600 text-neutral-600 bg-white font-semibold"
              : "bg-gray text-neutral-500 hover:bg-neutral-200"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export const EventsClearFiltersText = () => {
  const { setIndexUiState } = useInstantSearch();
  const { refine: refineSortBy } = useSortBy({ items: SORT_BY_ITEMS });

  return (
    <div
      className="flex items-center gap-1 group cursor-pointer"
      onClick={() => {
        if (USE_FIRST_DATE_OF_EVENT_SORT) {
          refineSortBy(EVENTS_INDEX_SORT_BY_FIRST_DATE);
        }
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
