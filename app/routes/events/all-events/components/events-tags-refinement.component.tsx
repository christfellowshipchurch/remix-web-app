import startCase from 'lodash/startCase';
import Icon from '~/primitives/icon';

import type { EventFinderFacetItem } from '../loader';
import type { EventsFinderUrlState } from '../../events-url-state';
import {
  EVENT_FACET_CATEGORIES,
  EVENTS_INDEX,
  MAIN_EVENTS_GRID_HITS_PER_PAGE,
  MAIN_EVENTS_TYPE_FILTER,
} from '../all-events-page';

/** Re-export for any remaining imports of the index name / filters. */
export {
  EVENTS_INDEX,
  MAIN_EVENTS_GRID_HITS_PER_PAGE,
  MAIN_EVENTS_TYPE_FILTER,
};

export const EventsTagsRefinementList = ({
  categoryFacets,
  urlState,
  applyUrlState,
}: {
  categoryFacets: EventFinderFacetItem[];
  urlState: EventsFinderUrlState;
  applyUrlState: (next: EventsFinderUrlState) => void;
}) => {
  const selectedCategories =
    urlState.refinementList?.[EVENT_FACET_CATEGORIES] ?? [];
  const selectedCategory =
    selectedCategories.length === 1 ? selectedCategories[0] : null;

  const handleCategoryClick = (category: string | null) => {
    const rl = {
      ...(urlState.refinementList as Record<string, string[]> | undefined),
    };
    if (category === null) {
      delete rl[EVENT_FACET_CATEGORIES];
    } else {
      rl[EVENT_FACET_CATEGORIES] = [category];
    }
    const refinementList = Object.keys(rl).length > 0 ? rl : undefined;
    applyUrlState({
      ...urlState,
      page: 0,
      refinementList,
    });
  };

  return (
    <div className='-ml-5 flex w-screen flex-nowrap gap-6 overflow-x-auto scrollbar-hide px-1 pb-4 md:ml-0 md:w-full'>
      <button
        type='button'
        onClick={() => handleCategoryClick(null)}
        className={`ml-4 flex shrink-0 cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm whitespace-nowrap transition-colors duration-300 md:ml-0 ${
          selectedCategory === null
            ? 'bg-ocean/10 text-ocean hover:bg-gray'
            : 'bg-gray font-semibold text-neutral-darker hover:bg-ocean/10 hover:text-ocean'
        }`}
      >
        Upcoming
      </button>

      {categoryFacets.map((item) => {
        const isSelected = selectedCategory === item.value;
        const pillBase =
          'inline-flex shrink-0 items-center rounded-full text-sm whitespace-nowrap transition-colors duration-300';
        const selectedStyles = 'bg-ocean/10 text-ocean hover:bg-gray';
        const idleStyles =
          'bg-gray font-semibold text-neutral-darker hover:bg-ocean/10 hover:text-ocean';

        if (isSelected) {
          const label = startCase(item.label);
          return (
            <div
              key={item.value}
              className={`${pillBase} cursor-default ${selectedStyles}`}
            >
              <button
                type='button'
                onClick={() => handleCategoryClick(item.value)}
                className='cursor-pointer py-3 pl-6 pr-2 text-sm'
              >
                {label}
              </button>
              <button
                type='button'
                onClick={() => handleCategoryClick(null)}
                aria-label={`Clear ${label} filter`}
                className='flex cursor-pointer items-center py-3 pr-5 pl-1'
              >
                <Icon name='x' size={18} className='shrink-0' />
              </button>
            </div>
          );
        }

        return (
          <button
            key={item.value}
            type='button'
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
