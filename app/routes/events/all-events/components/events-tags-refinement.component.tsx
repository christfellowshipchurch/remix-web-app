import { useState, useEffect } from "react";
import { useInstantSearch, useRefinementList } from "react-instantsearch";
import Icon from "~/primitives/icon";

export const EventsTagsRefinementList = () => {
  const { items } = useRefinementList({ attribute: "eventTags" });
  const { setIndexUiState, indexUiState } = useInstantSearch();
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
      // "Recent" - clear all refinements
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          eventTags: [],
        },
        page: 0, // Reset to first page
      }));
    } else {
      // Specific tag
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
    <div className="flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide">
      {/* Recent Tag */}
      <button
        onClick={() => handleTagClick(null)}
        className={`text-lg shrink-0 px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap cursor-pointer transition-colors duration-300 ${
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

  return (
    <div className="hidden md:flex items-center gap-1 group">
      <p
        className="w-fit text-ocean underline group-hover:text-navy transition-colors duration-300 cursor-pointer"
        onClick={() => {
          setIndexUiState((state) => ({
            ...state,
            refinementList: {},
          }));
        }}
      >
        Clear All Filters
      </p>
      <Icon
        name="x"
        className="text-ocean group-hover:text-navy transition-colors duration-300"
      />
    </div>
  );
};
