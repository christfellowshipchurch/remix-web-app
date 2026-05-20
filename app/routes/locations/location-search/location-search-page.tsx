import {
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
} from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { algoliasearch, SearchClient } from 'algoliasearch';
import { Configure, InstantSearch } from 'react-instantsearch';

import { ANCHOR_SCROLL_OFFSET } from '~/components/navbar/scroll-offset.constants';
import { useResponsive } from '~/hooks/use-responsive';
import { getCurrentPositionFromUserGesture } from '~/lib/browser-geolocation';
import { RootLoaderData } from '~/routes/navbar/loader';
import { emptySearchClient } from '~/routes/search/route';
import type { LocationSearchLoaderData } from './loader';
import { LOCATION_SEARCH_INDEX_NAME } from './location-search.constants';
import {
  LocationCardGrid,
  LocationCardList,
} from './partials/location-card-list.partial';
import { Search } from './partials/locations-search-hero.partial';

export type LocationSearchCoordinatesType = {
  results: [
    {
      geometry: {
        location: {
          latitutde: number;
          longitude: number;
        };
      };
    },
  ];
  status: string;
  error: string | undefined | null;
};

type GeocodeFetcherData = {
  requestId?: string;
  results?: Array<{
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  }>;
};

type CoordinateRequestSource = 'zip' | 'gps' | 'auto-gps' | 'clear';

let globalSearchClient: SearchClient | null = null;

function LocationSearchIndexBody({
  coordinates,
  setSearchCoordinates,
  handleSearch,
  beginCoordinateRequest,
  isLatestCoordinateRequest,
  geocodeLoading,
  initialLocationHits,
}: {
  coordinates: { lat: number | null; lng: number | null } | null;
  setSearchCoordinates: (
    next: { lat: number | null; lng: number | null } | null,
    options?: { scrollWithNavbarOffset?: boolean },
  ) => void;
  handleSearch: (query: string | null) => void;
  beginCoordinateRequest: (source: CoordinateRequestSource) => string;
  isLatestCoordinateRequest: (requestId: string) => boolean;
  geocodeLoading: boolean;
  initialLocationHits: LocationSearchLoaderData['initialLocationHits'];
}) {
  const hasCoordinates = coordinates?.lat != null && coordinates.lng != null;

  return (
    <>
      <Configure
        hitsPerPage={20}
        aroundLatLng={
          hasCoordinates ? `${coordinates.lat}, ${coordinates.lng}` : undefined
        }
        aroundRadius='all'
        aroundLatLngViaIP={false}
        getRankingInfo={true}
      />

      <Search
        handleSearch={handleSearch}
        setCoordinates={setSearchCoordinates}
        beginCoordinateRequest={beginCoordinateRequest}
        isLatestCoordinateRequest={isLatestCoordinateRequest}
      />
      <LocationCardList
        loading={geocodeLoading}
        initialHits={initialLocationHits}
        isDistanceSearch={hasCoordinates}
      />
    </>
  );
}

export function LocationSearchPage() {
  const loaderData = useLoaderData<LocationSearchLoaderData>();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const algolia =
    rootData?.algolia?.ALGOLIA_APP_ID && rootData.algolia.ALGOLIA_SEARCH_API_KEY
      ? rootData.algolia
      : {
          ALGOLIA_APP_ID: loaderData.ALGOLIA_APP_ID,
          ALGOLIA_SEARCH_API_KEY: loaderData.ALGOLIA_SEARCH_API_KEY,
        };
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = algolia;

  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(null);

  const campusScrollUsesNavbarOffsetRef = useRef(false);
  const desktopAutoGeolocationAttemptedRef = useRef(false);
  const coordinateRequestIdRef = useRef(0);
  const latestCoordinateRequestRef = useRef<string | null>(null);
  const { isLarge } = useResponsive();

  const beginCoordinateRequest = useCallback(
    (source: CoordinateRequestSource) => {
      coordinateRequestIdRef.current += 1;
      const requestId = `locations-${source}-${coordinateRequestIdRef.current}`;
      latestCoordinateRequestRef.current = requestId;
      return requestId;
    },
    [],
  );

  const isLatestCoordinateRequest = useCallback((requestId: string) => {
    return latestCoordinateRequestRef.current === requestId;
  }, []);

  const setSearchCoordinates = useCallback(
    (
      next: {
        lat: number | null;
        lng: number | null;
      } | null,
      options?: { scrollWithNavbarOffset?: boolean },
    ) => {
      campusScrollUsesNavbarOffsetRef.current =
        options?.scrollWithNavbarOffset ?? false;
      setCoordinates(next);
    },
    [],
  );

  const geocodeFetcher = useFetcher();
  const geocodeFetcherRef = useRef(geocodeFetcher);
  geocodeFetcherRef.current = geocodeFetcher;

  const handleSearch = useCallback(
    (query: string | null) => {
      if (!query) {
        beginCoordinateRequest('clear');
        setSearchCoordinates(null);
        return;
      }
      const requestId = beginCoordinateRequest('zip');
      const formData = new FormData();
      formData.append('address', query);
      formData.append('requestId', requestId);
      geocodeFetcherRef.current.submit(formData, {
        method: 'post',
        action: '/google-geocode',
      });
    },
    [beginCoordinateRequest, setSearchCoordinates],
  );

  useEffect(() => {
    if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY && !globalSearchClient) {
      globalSearchClient = algoliasearch(
        ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY,
        {},
      );
    }
  }, [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]);

  /**
   * One-time auto geolocation on large viewports only (Tailwind `lg` / 1024px+).
   * Skips phones and small tablets so iOS Safari is not prompted without a tap; desktop browsers
   * generally allow the prompt on load.
   */
  useEffect(() => {
    if (!isLarge || desktopAutoGeolocationAttemptedRef.current) return;
    desktopAutoGeolocationAttemptedRef.current = true;
    const requestId = beginCoordinateRequest('auto-gps');
    getCurrentPositionFromUserGesture(
      (position) => {
        if (!isLatestCoordinateRequest(requestId)) return;
        setSearchCoordinates(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          { scrollWithNavbarOffset: false },
        );
      },
      () => {
        /* silent — user can still use “Use my current location” */
      },
    );
  }, [
    beginCoordinateRequest,
    isLarge,
    isLatestCoordinateRequest,
    setSearchCoordinates,
  ]);

  const scrollCampusesIntoView = useCallback(() => {
    const campusesSection = document.getElementById('campuses');
    if (!campusesSection) {
      return;
    }
    const offsetPx = campusScrollUsesNavbarOffsetRef.current
      ? ANCHOR_SCROLL_OFFSET
      : 0;
    const offsetTop =
      campusesSection.getBoundingClientRect().top + window.scrollY - offsetPx;
    window.scrollTo({
      top: Math.max(0, offsetTop),
      behavior: 'smooth',
    });
  }, []);

  const geocodeData = geocodeFetcher.data as GeocodeFetcherData | undefined;
  const geocodeLat = geocodeData?.results?.[0]?.geometry?.location?.lat ?? null;
  const geocodeLng = geocodeData?.results?.[0]?.geometry?.location?.lng ?? null;

  useEffect(() => {
    if (geocodeLat == null || geocodeLng == null) return;
    if (
      !geocodeData?.requestId ||
      !isLatestCoordinateRequest(geocodeData.requestId)
    ) {
      return;
    }
    campusScrollUsesNavbarOffsetRef.current = true;
    setCoordinates((prev) => {
      if (prev?.lat === geocodeLat && prev?.lng === geocodeLng) return prev;
      return { lat: geocodeLat, lng: geocodeLng };
    });
  }, [
    geocodeData?.requestId,
    geocodeLat,
    geocodeLng,
    isLatestCoordinateRequest,
  ]);

  useEffect(() => {
    if (
      coordinates != null &&
      coordinates.lat != null &&
      coordinates.lng != null
    ) {
      const timeoutId = window.setTimeout(() => {
        scrollCampusesIntoView();
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [coordinates, scrollCampusesIntoView]);

  const searchClient =
    globalSearchClient ||
    (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY
      ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {})
      : emptySearchClient);

  const [algoliaBootstrapped, setAlgoliaBootstrapped] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const client =
      globalSearchClient ||
      (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY
        ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {})
        : emptySearchClient);

    const finish = () => {
      if (!cancelled) setAlgoliaBootstrapped(true);
    };

    void (async () => {
      try {
        if (
          'searchSingleIndex' in client &&
          typeof (client as SearchClient).searchSingleIndex === 'function'
        ) {
          await (client as SearchClient).searchSingleIndex({
            indexName: LOCATION_SEARCH_INDEX_NAME,
            searchParams: { hitsPerPage: 1, query: '' },
          });
        } else if ('search' in client && typeof client.search === 'function') {
          await (
            client as { search: (params?: unknown) => Promise<unknown> }
          ).search([]);
        }
      } catch {
        // Network or Algolia errors — still mount finder so the page is usable
      } finally {
        finish();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]);

  return (
    <div className='flex w-full flex-col min-h-screen'>
      {!algoliaBootstrapped ? (
        <>
          <Search
            handleSearch={handleSearch}
            setCoordinates={setSearchCoordinates}
            beginCoordinateRequest={beginCoordinateRequest}
            isLatestCoordinateRequest={isLatestCoordinateRequest}
            instantSearchReady={false}
          />
          <LocationCardGrid
            items={loaderData.initialLocationHits}
            loading={false}
            isDistanceSearch={false}
          />
        </>
      ) : (
        <InstantSearch
          indexName={LOCATION_SEARCH_INDEX_NAME}
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          initialUiState={{
            [LOCATION_SEARCH_INDEX_NAME]: {
              query: '',
            },
          }}
          insights={false}
        >
          <LocationSearchIndexBody
            coordinates={coordinates}
            setSearchCoordinates={setSearchCoordinates}
            handleSearch={handleSearch}
            beginCoordinateRequest={beginCoordinateRequest}
            isLatestCoordinateRequest={isLatestCoordinateRequest}
            geocodeLoading={geocodeFetcher.state === 'loading'}
            initialLocationHits={loaderData.initialLocationHits}
          />
        </InstantSearch>
      )}
    </div>
  );
}
