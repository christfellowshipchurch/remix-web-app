import { Link } from 'react-router-dom';
import kebabCase from 'lodash/kebabCase';
import { useHits, useInstantSearch } from 'react-instantsearch';

import LocationCard from '../components/locations-search-card.component';
import { LocationsLoader } from '../components/locations-search-skeleton.component';

export type CampusHit = {
  campusUrl: string;
  campusName: string;
  geoloc: {
    latitude: number;
    longitude: number;
  };
  campusLocation: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
  };
  serviceTimes: string;
  objectID?: string;
  _rankingInfo?: {
    geoDistance?: number;
    distance?: number;
  };
};

export type LocationCardListProps = {
  loading: boolean;
  initialHits?: CampusHit[];
};

/** Static card art: `public/assets/images/locations/location-card-images/{campusUrl}.webp` */
const LOCATION_CARD_IMAGES_BASE =
  '/assets/images/locations/location-card-images';

function locationSearchCardImage(hitUrl: string) {
  const slug = hitUrl.trim();
  return slug ? `${LOCATION_CARD_IMAGES_BASE}/${slug}.webp` : '';
}

export const LocationCardList = ({
  loading,
  initialHits = [],
}: LocationCardListProps) => {
  const { items } = useHits<CampusHit>();
  const { status } = useInstantSearch();
  const isSearchLoading = status === 'loading' || status === 'stalled';
  const hits = isSearchLoading && items.length === 0 ? initialHits : items;

  return <LocationCardGrid items={hits} loading={loading} />;
};

function isOnlineCampus(item: CampusHit) {
  return (
    item.campusUrl === 'cf-everywhere' || item.campusName?.includes('Online')
  );
}

function getLocationCardLink(hit: CampusHit) {
  if (isOnlineCampus(hit)) {
    return '/cf-everywhere';
  }

  if (hit?.campusName?.includes('Español')) {
    const url = hit.campusName.substring(25, hit.campusName.length);
    return `/iglesia-${kebabCase(url)}`;
  }

  return `/${kebabCase(hit?.campusName)}`;
}

function getDistanceFromLocation(hit: CampusHit) {
  const geoDistance = hit?._rankingInfo?.geoDistance;
  return typeof geoDistance === 'number' ? geoDistance / 1609.34 : undefined;
}

/**
 * /location (Location Search page) always lists the Online campus first, then
 * physical campuses in Algolia order (distance when coordinates are set).
 * Home/nav location popups use different rules via `sortCampusHitsForDistanceSearch`.
 */
export function getLocationCardDisplayItems(items: CampusHit[]) {
  return [
    ...items.filter((item) => isOnlineCampus(item)),
    ...items.filter((item) => !isOnlineCampus(item)),
  ];
}

export function LocationCardGrid({
  items,
  loading,
}: {
  items: CampusHit[];
  loading: boolean;
}) {
  const displayItems = getLocationCardDisplayItems(items);

  if (loading) {
    return (
      <div
        className='flex w-full flex-col items-center justify-center py-12 md:px-5 lg:px-2'
        id='campuses'
      >
        <LocationsLoader />
      </div>
    );
  }

  return (
    <div
      className='flex w-full flex-col items-center justify-center py-12 md:px-5 lg:px-2'
      id='campuses'
    >
      {/* Hits */}
      <div className='grid max-w-[1100px] grid-cols-12 gap-5 md:gap-y-10'>
        {displayItems.map((hit, index) => {
          return (
            <LocationCard
              name={hit?.campusName}
              image={locationSearchCardImage(hit.campusUrl)}
              distanceFromLocation={getDistanceFromLocation(hit)}
              key={hit.objectID || index}
              link={getLocationCardLink(hit)}
            />
          );
        })}
      </div>

      {/* Prison Location */}
      <div className='mt-24'>
        <Link to='/ministries/prison' prefetch='intent'>
          <div className="relative h-[150px] w-[90vw] overflow-hidden rounded-md transition-transform duration-300 md:h-[250px] md:w-[600px] lg:hover:-translate-y-3 bg-cover bg-center bg-no-repeat bg-[url('https://cloudfront.christfellowship.church/Content/Digital%20Platform/Location/prison-location.jpeg')]">
            <div
              className='absolute size-full opacity-80'
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0, 0, 0, 0), #353535)',
              }}
            />
            <h3 className='absolute bottom-0 left-0 pb-6 pl-6 text-2xl font-bold text-white'>
              Prison Locations
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
