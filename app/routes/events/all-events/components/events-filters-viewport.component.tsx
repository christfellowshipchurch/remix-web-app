import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import { AlgoliaFinderClearAllButton } from '~/routes/group-finder/components/clear-all-button.component';

import type { EventFinderFacetItem } from '../loader';
import {
  hasEventsFinderUrlActiveFilters,
  type EventsFinderUrlState,
} from '../../events-url-state';

import { EventsHubLocationSearch } from './events-hub-location-search.component';
import { EventsMobileFinderFilters } from './events-mobile-finder-filters.component';
import { EventsTagsRefinementList } from './events-tags-refinement.component';

/**
 * Same outer spacing as the real desktop/mobile filter rows.
 * Keeping this visible briefly after mount prevents the controls from popping in
 * from an empty area when hydration/browser measurement is still catching up.
 */
function EventsFiltersSkeleton() {
  return (
    <>
      <div className='hidden md:block content-padding'>
        <div className='mx-auto w-full max-w-screen-content'>
          <div
            className='py-8 md:py-10 flex min-h-[124px] items-center justify-between gap-4 overflow-hidden'
            aria-hidden
          >
            <div className='flex min-w-0 flex-nowrap items-center gap-6'>
              <div className='h-11 w-[260px] animate-pulse rounded-lg bg-neutral-200' />
              <div className='h-11 w-28 animate-pulse rounded-full bg-neutral-200' />
              <div className='h-11 w-32 animate-pulse rounded-full bg-neutral-200' />
              <div className='h-11 w-28 animate-pulse rounded-full bg-neutral-200' />
            </div>
            <div className='h-10 w-24 shrink-0 animate-pulse rounded-full bg-neutral-200' />
          </div>
        </div>
      </div>

      <div className='mt-2 w-full min-w-0 md:hidden'>
        <div className='z-20 w-full min-w-0 border-b border-black/5 bg-white shadow-sm content-padding select-none'>
          <div
            className='mx-auto flex min-h-22 w-full max-w-screen-content min-w-0 flex-col justify-center gap-3 py-4'
            aria-hidden
          >
            <div className='flex min-w-0 items-stretch gap-2'>
              <div className='h-11 flex-1 animate-pulse rounded-lg bg-neutral-200' />
              <div className='h-11 flex-1 animate-pulse rounded-lg bg-neutral-200' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Desktop location + category controls or mobile finder strip — URL-driven (no InstantSearch).
 */
export function EventsFiltersViewport({
  onClearAllToUrl,
  eventsMobilePinEndRef,
  urlState,
  applyUrlState,
  categoryFacets,
  locationFacets,
}: {
  onClearAllToUrl: () => void;
  eventsMobilePinEndRef?: RefObject<HTMLDivElement | null>;
  urlState: EventsFinderUrlState;
  applyUrlState: (next: EventsFinderUrlState) => void;
  categoryFacets: EventFinderFacetItem[];
  locationFacets: EventFinderFacetItem[];
}) {
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setFiltersReady(true), 150);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!filtersReady) {
    return <EventsFiltersSkeleton />;
  }

  return (
    <>
      <div className='hidden md:block content-padding'>
        <div className='mx-auto w-full max-w-screen-content'>
          <div className='py-8 md:py-10 flex items-center justify-between gap-4 overflow-y-visible'>
            <div className='flex flex-col gap-6 md:flex-row md:flex-nowrap'>
              <EventsHubLocationSearch
                locationFacets={locationFacets}
                urlState={urlState}
                applyUrlState={applyUrlState}
              />
              <EventsTagsRefinementList
                categoryFacets={categoryFacets}
                urlState={urlState}
                applyUrlState={applyUrlState}
              />
            </div>
            <div className='shrink-0'>
              <AlgoliaFinderClearAllButton
                urlManaged
                urlFiltersActive={hasEventsFinderUrlActiveFilters(urlState)}
                onClearAllToUrl={onClearAllToUrl}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-2 w-full min-w-0 md:hidden'>
        <EventsMobileFinderFilters
          onClearAllToUrl={onClearAllToUrl}
          pinEndRef={eventsMobilePinEndRef}
          categoryFacets={categoryFacets}
          locationFacets={locationFacets}
          urlState={urlState}
          applyUrlState={applyUrlState}
        />
      </div>
    </>
  );
}
