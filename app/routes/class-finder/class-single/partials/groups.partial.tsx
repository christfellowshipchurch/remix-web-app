import type { GroupType } from '~/routes/group-finder/types';

import { ClassSingleGroupsCarousel } from '../components/class-single-groups-carousel.component';

export type ClassSingleGroupsSectionProps = {
  groupHits: GroupType[];
  classUrl: string;
};

/**
 * Related groups carousel — hits are prefetched in the route loader (mirrors session URL filters/geo).
 * Intentionally outside Filter Sessions InstantSearch (nested Index was unreliable in production).
 */
export function ClassSingleGroupsSection({
  groupHits,
  classUrl,
}: ClassSingleGroupsSectionProps) {
  if (groupHits.length === 0) {
    return null;
  }

  const backUrl = `/class-finder/${classUrl}`;
  const resetKey = groupHits.map((h) => h.objectID).join('|');

  return (
    <div className='w-full max-w-[1296px] mr-auto py-16 border-t border-neutral-lighter'>
      <div className='flex w-full flex-col items-center gap-4'>
        <h2 className='w-full text-2xl font-extrabold leading-[1.4]'>
          Join a Group
        </h2>
        <div className='flex w-full justify-center md:justify-start'>
          <ClassSingleGroupsCarousel
            hits={groupHits}
            resetKey={resetKey}
            backUrl={backUrl}
          />
        </div>
      </div>
    </div>
  );
}
