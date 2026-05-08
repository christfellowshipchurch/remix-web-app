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

/** Grid (not flex + justify-center) so the label column gets minmax(0,1fr), truncates on narrow widths, and the × stays visible. */
const selectedPillClass = cn(
  'grid shrink items-center gap-1',
  pillVisualClass,
  'min-h-0 min-w-0 max-w-full cursor-default grid-cols-[minmax(0,1fr)_auto] bg-ocean/10 px-4 py-2 text-ocean hover:bg-ocean/10 md:py-2.5',
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
            className={cn(selectedClass, 'min-w-0 max-w-full shrink')}
            role='group'
            aria-label={`Active filter ${item.label}`}
          >
            <span className='min-w-0 truncate' title={item.label}>
              {item.label}
            </span>
            <button
              type='button'
              className={removeBtnClass}
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
