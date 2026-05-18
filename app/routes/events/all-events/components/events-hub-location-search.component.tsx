import Dropdown, {
  type DropdownOption,
} from '~/primitives/inputs/dropdown/dropdown.primitive';
import { cn } from '~/lib/utils';

import type { EventFinderFacetItem } from '../loader';
import type { EventsFinderUrlState } from '../../events-url-state';
import { EVENT_FACET_LOCATIONS } from '../all-events-page';

interface EventsHubLocationSearchProps {
  placeholder?: string;
  locationFacets: EventFinderFacetItem[];
  urlState: EventsFinderUrlState;
  applyUrlState: (next: EventsFinderUrlState) => void;
}

export const EventsHubLocationSearch = ({
  placeholder = 'Select Campus',
  locationFacets,
  urlState,
  applyUrlState,
}: EventsHubLocationSearchProps) => {
  const selectedLocation =
    urlState.refinementList?.[EVENT_FACET_LOCATIONS]?.[0] || '';

  const locationOptions: DropdownOption[] = [
    { value: '', label: 'Filter By Campus Location' },
    ...locationFacets.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  ];

  const handleLocationSelect = (locationValue: string) => {
    const rl = {
      ...(urlState.refinementList as Record<string, string[]> | undefined),
    };
    if (locationValue) {
      rl[EVENT_FACET_LOCATIONS] = [locationValue];
    } else {
      delete rl[EVENT_FACET_LOCATIONS];
    }
    const refinementList = Object.keys(rl).length > 0 ? rl : undefined;
    applyUrlState({
      ...urlState,
      page: 0,
      refinementList,
    });
  };

  const hasCampusFilter = Boolean(selectedLocation);

  return (
    <Dropdown
      options={locationOptions}
      value={selectedLocation}
      onChange={handleLocationSelect}
      placeholder={placeholder}
      className='min-w-[260px]'
      triggerIcon='map'
      triggerIconClassName={cn(
        'transition-colors duration-300',
        hasCampusFilter ? 'text-ocean' : 'text-neutral-default',
      )}
      triggerClassName={cn(
        'md:rounded-lg md:px-4 md:py-2.5 md:text-sm md:font-semibold md:shadow-none md:transition-all md:duration-300',
        hasCampusFilter
          ? 'md:border-ocean md:bg-ocean/10 md:text-ocean md:hover:border-ocean'
          : 'md:border-[#DEE0E3] md:text-neutral-default md:hover:border-neutral-default',
      )}
      openTriggerClassName={
        hasCampusFilter
          ? undefined
          : 'md:border-ocean md:bg-ocean/10 md:text-ocean md:hover:border-ocean'
      }
      menuClassName='md:border-[#909090] md:shadow-md'
      chevronColor={hasCampusFilter ? 'text-ocean' : 'text-neutral-default'}
      chevronReflectsOpenState
    />
  );
};
