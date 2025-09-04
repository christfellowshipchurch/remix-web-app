import { useState } from "react";
import { useInstantSearch, useRefinementList } from "react-instantsearch";

export const MessagesTagsRefinementList = ({
  tagName = "sermonPrimaryTags",
}: {
  tagName: string;
}) => {
  const { items } = useRefinementList({ attribute: tagName });
  const { setIndexUiState } = useInstantSearch();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);

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
    <div className="flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto">
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
