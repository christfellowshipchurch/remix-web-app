import { useRef } from 'react';
import { useRefinementList, useInstantSearch } from 'react-instantsearch';

import {
  getAvailablePageContentTypes,
  hasVisiblePageRefinements,
  isPagesRefinementSelected,
  isPageContentType,
  useClearStalePageRefinements,
  withoutPageContentTypes,
} from '../../search-page-refinements';
import { useGlobalSearchLocationMatches } from '../../global-search-location-context';

export const MobileSearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  const { items, refine } = useRefinementList({ attribute });
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasMatchingLocations } = useGlobalSearchLocationMatches();

  const selectedItems =
    (indexUiState?.refinementList?.[attribute] as string[]) || [];
  const isPagesSelected = isPagesRefinementSelected(selectedItems);
  const showPagesFilter = hasVisiblePageRefinements(
    items,
    hasMatchingLocations,
  );

  useClearStalePageRefinements({
    attribute,
    items,
    selectedItems,
    setIndexUiState,
    hasMatchingLocationResults: hasMatchingLocations,
  });

  const filteredItems = items.filter((item) => !isPageContentType(item.value));

  const scrollToStart = () => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleItemClick = (value: string) => {
    refine(value);
    scrollToStart();
  };

  const handlePagesClick = () => {
    const nonPageSelected = withoutPageContentTypes(selectedItems);

    if (isPagesSelected) {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [attribute]: nonPageSelected,
        },
      }));
    } else {
      setIndexUiState((prevState) => ({
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [attribute]: [
            ...nonPageSelected,
            ...getAvailablePageContentTypes(items),
          ],
        },
      }));
    }

    scrollToStart();
  };

  return (
    <div
      ref={containerRef}
      className='flex gap-2 overflow-x-scroll max-w-screen pr-8 pb-2 scrollbar-hide'
    >
      {showPagesFilter ? (
        <button
          onClick={handlePagesClick}
          className={`flex items-center justify-center text-center text-sm font-bold px-4 py-1 whitespace-nowrap transition-all duration-300 ml-4 ${
            isPagesSelected
              ? 'text-white bg-navy rounded-[55px]'
              : 'text-[#7B7382]'
          }`}
        >
          Pages
        </button>
      ) : null}

      {filteredItems.map((item) => {
        const isSelected = selectedItems.includes(item.value);

        return (
          <button
            key={item.value}
            onClick={() => handleItemClick(item.value)}
            className={`flex items-center justify-center text-center text-sm font-bold px-4 py-1 whitespace-nowrap transition-all duration-300 ${
              isSelected
                ? 'text-white bg-navy rounded-[55px]'
                : 'text-[#7B7382]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
