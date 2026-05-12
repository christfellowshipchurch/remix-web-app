import { useInstantSearch, useRefinementList } from 'react-instantsearch';

import { Icon } from '~/primitives/icon/icon';
import { cn } from '~/lib/utils';

export type HubsTagsRefinementListProps = {
  /** Algolia facet attribute (e.g. `articlePrimaryCategories`, `sermonPrimaryCategories`, `topic`). */
  attribute?: string;
  wrapperClass?: string;
  /** Full class string for unselected pills (defaults to hub/article styling). */
  unselectedClassName?: string;
  /** Full class string for the selected pill container (defaults to hub/article styling). */
  selectedClassName?: string;
  /** Full class string for the remove (×) control (defaults to hub/article styling). */
  removeButtonClassName?: string;
};

const pillVisualClass =
  'rounded-[999px] text-sm font-semibold transition-colors duration-300';

const unselectedPillClass = cn(
  'flex shrink-0 items-center',
  pillVisualClass,
  'w-fit max-w-full cursor-pointer justify-center whitespace-nowrap bg-gray px-4 py-2 text-text-primary hover:bg-neutral-200 md:py-2.5',
);

/**
 * Selected pill: grid so label + × share a row; shrink-0 so the chip is not squashed in the
 * horizontal scroll row; max-width + wrap so the full label is readable (no truncate ellipsis).
 */
const selectedPillClass = cn(
  'grid w-max max-w-[min(100%,calc(100vw-2.5rem))] shrink-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-0.5',
  pillVisualClass,
  'cursor-default bg-ocean/10 px-4 py-2 text-left text-ocean hover:bg-ocean/10 md:py-2.5',
);

const removeButtonClass =
  'shrink-0 cursor-pointer rounded-full p-0.5 text-ocean transition-colors hover:bg-ocean/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-1';

export const HubsTagsRefinementList = ({
  attribute = 'sermonPrimaryCategories',
  wrapperClass = 'flex gap-2 md:gap-4 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide',
  unselectedClassName,
  selectedClassName,
  removeButtonClassName,
}: HubsTagsRefinementListProps) => {
  const { items } = useRefinementList({ attribute });
  const { setIndexUiState } = useInstantSearch();

  const unselectedClass = unselectedClassName ?? unselectedPillClass;
  const selectedClass = selectedClassName ?? selectedPillClass;
  const removeBtnClass = removeButtonClassName ?? removeButtonClass;

  const selectOnlyValue = (value: string) => {
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {
        ...prevState.refinementList,
        [attribute]: [value],
      },
      page: 0,
    }));
  };

  const removeRefinementValue = (value: string) => {
    setIndexUiState((prevState) => {
      const rl = {
        ...(prevState.refinementList as Record<string, string[]> | undefined),
      };
      const current = rl[attribute] ?? [];
      const next = current.filter((v) => v !== value);
      if (next.length === 0) {
        delete rl[attribute];
      } else {
        rl[attribute] = next;
      }
      return { ...prevState, refinementList: rl, page: 0 };
    });
  };

  return (
    <div className={wrapperClass}>
      {items.map((item) =>
        item.isRefined ? (
          <div
            key={item.value}
            className={selectedClass}
            role='group'
            aria-label={`Active filter ${item.label}`}
          >
            <span className='min-w-0 break-words leading-snug'>
              {item.label}
            </span>
            <button
              type='button'
              className={cn(removeBtnClass, 'self-start pt-0.5')}
              aria-label={`Remove filter ${item.label}`}
              onClick={() => removeRefinementValue(item.value)}
            >
              <Icon name='x' className='text-ocean' size={16} />
            </button>
          </div>
        ) : (
          <button
            type='button'
            key={item.value}
            className={unselectedClass}
            onClick={() => selectOnlyValue(item.value)}
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  );
};

export const HubsTagsRefinementLoadingSkeleton = ({
  wrapperClass = 'flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide',
}: {
  wrapperClass?: string;
}) => {
  return (
    <div className={wrapperClass}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className='h-10 w-full bg-gray-100 animate-pulse rounded-lg'
        />
      ))}
    </div>
  );
};
