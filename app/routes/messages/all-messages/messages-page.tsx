/**
 * Algolia / finder constants for `/messages` — defined above UI imports so `loader.ts`
 * can import them without circular dependency issues.
 */
export const MESSAGES_ALGOLIA_INDEX_NAME = 'dev_contentItems' as const;
export const MESSAGES_SERMON_FILTER = 'contentType:"Sermon"' as const;
export const ALL_MESSAGES_GRID_HITS_PER_PAGE = 9;
export const CURRENT_SERIES_LOADER_HITS_PER_PAGE = 1;
export const SERMON_PRIMARY_CATEGORY_FACET = 'sermonPrimaryCategories' as const;

import { DynamicHero } from '~/components';
import CurrentSeries from './partials/current-series.partial';
import { AllMessages } from './partials/all-messages.partial';
import { getImageUrl } from '~/lib/utils';

export function MessagesPage() {
  return (
    <div className='flex flex-col'>
      <div className='flex-none'>
        <DynamicHero
          imagePath={getImageUrl('3143897')}
          ctas={[
            {
              href: 'https://www.youtube.com/@ChristFellowship.Church',
              title: 'Watch Live',
              target: '_blank',
            },
          ]}
        />
      </div>
      <CurrentSeries />
      <AllMessages />
    </div>
  );
}
