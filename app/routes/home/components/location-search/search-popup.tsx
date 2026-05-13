import { Hits } from 'react-instantsearch';
import { CampusHit, CampusHitType } from './location-hit';
import { Link } from 'react-router-dom';
import { Icon } from '~/primitives/icon/icon';

export const SearchPopup = ({
  onRequestPreciseLocation,
}: {
  /** Must run geolocation only from this click — not from useEffect (iOS Safari). */
  onRequestPreciseLocation: () => void;
}) => {
  return (
    <div className='w-full py-4 z-4 overflow-hidden min-h-[332px]'>
      {/* Search Results */}
      <div className='space-y-4'>
        <Hits
          classNames={{
            root: 'flex flex-col overflow-y-auto max-h-[300px]',
            item: 'flex w-full rounded-xl transition-transform duration-300 border-[1px] border-[#E8E8E8] [&:first-child]:!border-navy hover:border-navy',
            list: 'flex flex-col gap-3',
          }}
          hitComponent={({ hit }) => {
            if (hit?.campusUrl) {
              const campusData: CampusHitType = {
                campusUrl: hit.campusUrl,
                campusName: hit.campusName,
                geoloc: hit.geoloc,
                campusLocation: hit.campusLocation,
                serviceTimes: hit.serviceTimes,
              };
              return <CampusHit hit={campusData} />;
            }
            return null;
          }}
        />
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
