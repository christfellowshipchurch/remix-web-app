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

export const SearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  const { items, refine } = useRefinementList({ attribute });
  const { indexUiState, setIndexUiState } = useInstantSearch();
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

  const handleItemClick = (value: string) => {
    refine(value);
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
      return;
    }

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
  };

  const buttonClass =
    'flex items-center justify-center text-center text-xs border-[0.7px] px-4 py-2 max-h-[36px] whitespace-nowrap rounded-md transition-all duration-300';

  return (
    <div className='flex flex-wrap gap-2'>
      {showPagesFilter ? (
        <div
          className={`${buttonClass} ${
            isPagesSelected
              ? 'text-ocean border-ocean overflow-hidden group pr-3 hover:-translate-y-1'
              : 'border-neutral-light text-neutral-dark hover:text-ocean hover:border-ocean'
          }`}
        >
          <button
            onClick={handlePagesClick}
            className={`flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer ${
              isPagesSelected
                ? "pr-5 bg-[url('/assets/icons/xmark-solid.svg')] bg-[length:16px_16px] bg-[center_right_0px] bg-no-repeat"
                : ''
            }`}
          >
            Pages
          </button>
        </div>
      ) : null}

      {filteredItems.map((item) => {
        const isSelected = selectedItems.includes(item.value);

        return (
          <div
            key={item.value}
            className={`${buttonClass} ${
              isSelected
                ? 'text-ocean border-ocean overflow-hidden group pr-3 hover:-translate-y-1'
                : 'border-neutral-light text-neutral-dark hover:text-ocean hover:border-ocean'
            }`}
          >
            <button
              onClick={() => handleItemClick(item.value)}
              className={`flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer ${
                isSelected
                  ? "pr-5 bg-[url('/assets/icons/xmark-solid.svg')] bg-[length:16px_16px] bg-[center_right_0px] bg-no-repeat"
                  : ''
              }`}
            >
              {item.label}
            </button>
          </div>
        );
      })}
    </div>
  );
};
