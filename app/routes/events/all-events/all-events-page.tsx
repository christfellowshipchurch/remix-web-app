import { DynamicHero } from '~/components';

import { FeaturedEvents } from './partials/featured-events.partial';
import { AllEvents } from './partials/all-events';
import { getImageUrl } from '~/lib/utils';

export function AllEventsPage() {
  return (
    <div className='flex flex-col items-center'>
      <DynamicHero
        customTitle='Events'
        fullOverlay
        imagePath={getImageUrl('3143899')}
      />
      <FeaturedEvents />
      <AllEvents />
    </div>
  );
}
