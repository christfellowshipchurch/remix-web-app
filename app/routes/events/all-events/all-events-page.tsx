/**
 * Algolia / finder constants for this route — defined above UI imports so `loader.ts`
 * and components can import them without circular dependency issues.
 */
export const EVENTS_INDEX = 'dev_contentItems' as const;

/** Matches former `<Configure>` on the all-events page. */
export const MAIN_EVENTS_TYPE_FILTER = 'contentType:"Event"' as const;

export const MAIN_EVENTS_GRID_HITS_PER_PAGE = 9;

export const EVENT_FACET_CATEGORIES = 'eventCategories' as const;

export const EVENT_FACET_LOCATIONS = 'eventLocations' as const;

import { AllEventsContent } from './components/all-events-content.component';

export function AllEventsPage() {
  return (
    <div className='flex min-h-dvh w-full flex-col items-center'>
      <AllEventsContent />
    </div>
  );
}
