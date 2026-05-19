import { algoliasearch } from 'algoliasearch';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { getCurrentPositionFromUserGesture } from '~/lib/browser-geolocation';
import { SearchPopup } from './search-popup';
import { cn, isValidZip } from '~/lib/utils';
import { emptySearchClient } from '~/routes/search/route';
import { globalSearchClient } from '~/routes/search/route';
import { SearchBar } from './search-bar';
import { loader } from '~/routes/home/loader';

type GeocodeFetcherData = {
  requestId?: string;
  results?: {
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  }[];
};

export function LocationSearchInner({
  isSearching: controlledIsSearching,
  setIsSearching: controlledSetIsSearching,
}: {
  isSearching?: boolean;
  setIsSearching?: (isSearching: boolean) => void;
} = {}) {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<typeof loader>();
  const geocodeFetcher = useFetcher();
  const geocodeFetcherRef = useRef(geocodeFetcher);
  geocodeFetcherRef.current = geocodeFetcher;
  const submittedZipRef = useRef<string | null>(null);
  const geocodeRequestIdRef = useRef(0);
  const submittedGeocodeRequestIdRef = useRef<string | null>(null);
  const hasPendingGeocodeResponseRef = useRef(false);

  const locationSearchBarRef = useRef<HTMLDivElement>(null);
  const [internalIsSearching, setInternalIsSearching] = useState(false);

  const isSearching = controlledIsSearching ?? internalIsSearching;
  const setIsSearching = controlledSetIsSearching ?? setInternalIsSearching;
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isDistanceSearch, setIsDistanceSearch] = useState(false);

  useEffect(() => {
    if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY && !globalSearchClient) {
      // Reserved for future global client wiring
    }
  }, [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]);

  const searchClient =
    globalSearchClient ||
    (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY
      ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {})
      : emptySearchClient);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationSearchBarRef.current &&
        !locationSearchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsSearching]);

  const handleSearch = useCallback((query: string | null) => {
    if (!query || query.length !== 5 || !isValidZip(query)) {
      submittedZipRef.current = null;
      submittedGeocodeRequestIdRef.current = null;
      hasPendingGeocodeResponseRef.current = false;
      return;
    }
    const requestId = `home-location-${geocodeRequestIdRef.current + 1}`;
    geocodeRequestIdRef.current += 1;
    submittedZipRef.current = query;
    submittedGeocodeRequestIdRef.current = requestId;
    hasPendingGeocodeResponseRef.current = false;
    const formData = new FormData();
    formData.append('address', query);
    formData.append('requestId', requestId);
    geocodeFetcherRef.current.submit(formData, {
      method: 'post',
      action: '/google-geocode',
    });
  }, []);

  const handlePreciseLocationRequest = useCallback(() => {
    submittedZipRef.current = null;
    submittedGeocodeRequestIdRef.current = null;
    hasPendingGeocodeResponseRef.current = false;
    getCurrentPositionFromUserGesture(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsDistanceSearch(true);
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
    );
  }, []);

  useEffect(() => {
    if (geocodeFetcher.state !== 'idle') {
      hasPendingGeocodeResponseRef.current = true;
      return;
    }

    if (
      !submittedZipRef.current ||
      !hasPendingGeocodeResponseRef.current ||
      !geocodeFetcher.data
    ) {
      return;
    }

    const geocodeData = geocodeFetcher.data as GeocodeFetcherData;
    if (geocodeData.requestId !== submittedGeocodeRequestIdRef.current) {
      return;
    }

    hasPendingGeocodeResponseRef.current = false;

    const location = geocodeData.results?.[0]?.geometry?.location;
    if (
      !location ||
      typeof location.lat !== 'number' ||
      typeof location.lng !== 'number'
    ) {
      setCoordinates(null);
      return;
    }

    setCoordinates({
      lat: location.lat,
      lng: location.lng,
    });
    setIsDistanceSearch(true);
  }, [geocodeFetcher.data, geocodeFetcher.state]);

  return (
    <div className={cn(isSearching && 'mt-32')} ref={locationSearchBarRef}>
      <InstantSearch
        indexName='dev_Locations'
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        initialUiState={{
          dev_Locations: {
            query: '',
          },
        }}
        insights={false}
      >
        {coordinates?.lat && coordinates?.lng ? (
          <Configure
            hitsPerPage={20}
            aroundLatLng={`${coordinates.lat}, ${coordinates.lng}`}
            aroundRadius='all'
            aroundLatLngViaIP={false}
            getRankingInfo={true}
          />
        ) : (
          <Configure hitsPerPage={20} />
        )}

        <div
          className={cn(
            'relative w-full md:w-90 z-50 rounded-2xl transition-all duration-300',
            {
              'bg-white p-4 shadow-md sm:w-[450px] md:w-[620px] lg:w-[430px] lg:-translate-y-30 short-desktop:-translate-y-70':
                isSearching,
              'bg-transparent': !isSearching,
            },
          )}
        >
          <SearchBar
            onSearchStateChange={setIsSearching}
            onSearchSubmit={handleSearch}
            data-gtm='hero-cta'
          />
          {isSearching && (
            <SearchPopup
              isDistanceSearch={isDistanceSearch}
              onRequestPreciseLocation={handlePreciseLocationRequest}
            />
          )}
        </div>
      </InstantSearch>
    </div>
  );
}
