import { Link } from 'react-router-dom';
import { useHits } from 'react-instantsearch';

import { Icon } from '~/primitives/icon/icon';
import { CampusHit } from './location-hit';
import { sortCampusHitsForDistanceSearch } from './location-search-results';
import type { CampusHitType } from './location-hit';
import type { CampusSearchHit } from './location-search-results';

export const SearchPopup = ({
  isDistanceSearch,
  onRequestPreciseLocation,
}: {
  isDistanceSearch: boolean;
  /** Must run geolocation only from this click — not from useEffect (iOS Safari). */
  onRequestPreciseLocation: () => void;
}) => {
  const { items } = useHits<CampusSearchHit>();
  const hits = isDistanceSearch
    ? sortCampusHitsForDistanceSearch(items)
    : items;

  return (
    <div className='w-full py-4 z-4 overflow-hidden min-h-[332px]'>
      {/* Search Results */}
      <div className='space-y-4'>
        <div className='flex flex-col overflow-y-auto max-h-[300px]'>
          <ul className='flex flex-col gap-3'>
            {hits.map((hit, index) => {
              if (hit?.campusUrl) {
                const campusData: CampusHitType = {
                  campusUrl: hit.campusUrl,
                  campusName: hit.campusName,
                  geoloc: hit.geoloc,
                  campusLocation: hit.campusLocation,
                  serviceTimes: hit.serviceTimes,
                };
                return (
                  <li
                    key={hit.objectID ?? `${hit.campusUrl}-${index}`}
                    className='flex w-full rounded-xl border-[2.37px] border-[#E8E8E8] transition-colors duration-300 first:border-neutral-default hover:border-neutral-default'
                  >
                    <CampusHit hit={campusData} />
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex justify-between gap-2 pt-4'>
        <div
          className='flex gap-1 cursor-pointer text-ocean hover:text-navy transition-colors duration-300'
          onClick={() => {
            onRequestPreciseLocation();
          }}
        >
          <Icon name='currentLocation' size={21} />
          <p className='text-sm font-semibold'>Use my precise location</p>
        </div>

        <Link to='/locations' prefetch='intent'>
          <p className='text-sm font-medium hover:underline transition-all duration-300'>
            View All Locations
          </p>
        </Link>
      </div>
    </div>
  );
};
