import { useState, useRef } from "react";
import { useInstantSearch, useRefinementList } from "react-instantsearch";

export const HubsTagsRefinementList = ({
  tagName = "sermonPrimaryTags",
  wrapperClass = "flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide",
  buttonClassDefault = "text-lg shrink-0 px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap cursor-pointer transition-colors duration-300",
  buttonClassSelected = "border border-neutral-600 text-neutral-600 bg-white font-semibold",
  buttonClassUnselected = "bg-gray text-neutral-500 hover:bg-neutral-200",
}: {
  tagName: string;
  wrapperClass?: string;
  buttonClassDefault?: string;
  buttonClassSelected?: string;
  buttonClassUnselected?: string;
}) => {
  const { items } = useRefinementList({ attribute: tagName });
  const { setIndexUiState } = useInstantSearch();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);

    // Scroll to the beginning of the wrapper element
    setTimeout(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 100);

    if (tag === null) {
      // "Recent" - clear all refinements
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [tagName]: [],
        },
        page: 0, // Reset to first page
      }));
    } else {
      // Specific tag
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [tagName]: [tag],
        },
        page: 0, // Reset to first page
      }));
    }
  };

  return (
    <div ref={wrapperRef} className={wrapperClass}>
      {/* Recent Tag */}
      <button
        onClick={() => handleTagClick(null)}
        className={`${buttonClassDefault} ${
          selectedTag === null ? buttonClassSelected : buttonClassUnselected
        }`}
      >
        Recent
      </button>

      {/* Dynamic Tags */}
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => handleTagClick(item.value)}
          className={`${buttonClassDefault} ${
            selectedTag === item.value
              ? buttonClassSelected
              : buttonClassUnselected
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export const HubsTagsRefinementLoadingSkeleton = ({
  wrapperClass = "flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide",
}: {
  wrapperClass?: string;
}) => {
  return (
    <div className={wrapperClass}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-10 w-full bg-gray-100 animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
};
