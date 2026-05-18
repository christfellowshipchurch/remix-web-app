import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import { FinderStickyBar } from '~/components/finders/finder-sticky-bar.component';
import { AlgoliaFinderClearAllButton } from '~/routes/group-finder/components/clear-all-button.component';

import type { EventFinderFacetItem } from '../loader';
import {
  hasEventsFinderUrlActiveFilters,
  type EventsFinderUrlState,
} from '../../events-url-state';

import { EventsHubLocationSearch } from './events-hub-location-search.component';
import { EventsMobileFinderFilters } from './events-mobile-finder-filters.component';
import { EventsTagsRefinementList } from './events-tags-refinement.component';

const MD_UP_MQ = '(min-width: 768px)';

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
  const [mounted, setMounted] = useState(false);
  const [isMdUp, setIsMdUp] = useState(true);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia(MD_UP_MQ);
    const apply = () => setIsMdUp(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (!mounted) {
    return (
      <>
        <div className='md:hidden'>
          <FinderStickyBar>
            <div className='mx-auto w-full max-w-screen-content'>
              <div className='min-h-[5.5rem]' />
            </div>
          </FinderStickyBar>
        </div>
        <div className='hidden md:block'>
          <div className='content-padding'>
            <div className='mx-auto w-full max-w-screen-content'>
              <div className='min-h-[72px]' />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isMdUp) {
    return (
      <div className='content-padding'>
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
    );
  }

  return (
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
  );
}
