import { useState } from "react";
import { useInstantSearch, useRefinementList } from "react-instantsearch";

export const DesktopArticlesTagsRefinementList = () => {
  const { items } = useRefinementList({ attribute: "articlePrimaryTags" });
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
          articlePrimaryTags: [],
        },
        page: 0, // Reset to first page
      }));
    } else {
      // Specific tag
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          articlePrimaryTags: [tag],
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

export const MobileArticlesTagsRefinementList = () => {
  const { items } = useRefinementList({ attribute: "articlePrimaryTags" });
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
          articlePrimaryTags: [],
        },
        page: 0, // Reset to first page
      }));
    } else {
      // Specific tag
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          articlePrimaryTags: [tag],
        },
        page: 0, // Reset to first page
      }));
    }
  };

  return (
    <div className="flex flex-nowrap px-1 pb-1 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => handleTagClick(null)}
        className={`w-fit min-w-[180px] flex justify-between group px-2 border-b-3 transition-colors ${
          selectedTag === null
            ? "border-ocean text-ocean"
            : "border-neutral-lighter text-text-secondary"
        }`}
      >
        <h3 className="font-semibold">Recent</h3>
      </button>

      {/* Dynamic Tags */}
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => handleTagClick(item.value)}
          className={`w-fit min-w-[150px] flex justify-between group px-2 border-b-3 transition-colors ${
            selectedTag === item.value
              ? "border-ocean text-ocean"
              : "border-neutral-lighter text-text-secondary"
          }`}
        >
          <h3 className="font-semibold">{item.label}</h3>
        </button>
      ))}
    </div>
  );
};
