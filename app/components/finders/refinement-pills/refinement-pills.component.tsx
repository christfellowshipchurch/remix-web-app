import { Icon } from '~/primitives/icon/icon';
import { cn } from '~/lib/utils';

type RefinementPillItem = {
  value: string;
  label: string;
};

const pillVisualClass =
  'rounded-[999px] text-sm font-semibold transition-colors duration-300';

const unselectedPillClass = cn(
  'flex shrink-0 items-center',
  pillVisualClass,
  'w-fit max-w-full cursor-pointer justify-center whitespace-nowrap bg-gray px-4 py-2 text-text-primary hover:bg-neutral-200 md:py-2.5',
);

const selectedPillClass = cn(
  'grid w-max max-w-[min(100%,calc(100vw-2.5rem))] shrink-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-0.5',
  pillVisualClass,
  'cursor-default bg-ocean/10 px-4 py-2 text-left text-ocean hover:bg-ocean/10 md:py-2.5',
);

const removeButtonClass =
  'shrink-0 cursor-pointer rounded-full p-0.5 text-ocean transition-colors hover:bg-ocean/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-1';

/**
 * Shared visual shell for single-select hub facet controls.
 *
 * This component intentionally does not know about Algolia. Articles and
 * messages pass in values from `useRefinementList`, then handle selection with
 * InstantSearch state. Keeping this presentational lets us reuse the same UI
 * while avoiding another custom state layer here.
 */
export function RefinementPills({
  items,
  selectedValues,
  onSelect,
  onRemove,
  className,
}: {
  items: RefinementPillItem[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex gap-2 md:gap-4 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide',
        className,
      )}
    >
      {items.map((item) => {
        const isRefined = selectedValues.includes(item.value);
        return isRefined ? (
          <div
            key={item.value}
            className={selectedPillClass}
            role='group'
            aria-label={`Active filter ${item.label}`}
          >
            <span className='min-w-0 wrap-break-word leading-snug'>
              {item.label}
            </span>
            <button
              type='button'
              className={cn(removeButtonClass, 'self-start pt-0.5')}
              aria-label={`Remove filter ${item.label}`}
              onClick={() => onRemove(item.value)}
            >
              <Icon name='x' className='text-ocean' size={16} />
            </button>
          </div>
        ) : (
          <button
            type='button'
            key={item.value}
            className={unselectedPillClass}
            onClick={() => onSelect(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
