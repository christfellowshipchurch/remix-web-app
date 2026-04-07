import { useFetcher, useRouteLoaderData } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { algoliasearch, SearchClient } from "algoliasearch";
import { Configure, InstantSearch } from "react-instantsearch";

import { ANCHOR_SCROLL_OFFSET } from "~/components/navbar/scroll-offset.constants";
import { useResponsive } from "~/hooks/use-responsive";
import { getCurrentPositionFromUserGesture } from "~/lib/browser-geolocation";
import { RootLoaderData } from "~/routes/navbar/loader";
import { emptySearchClient } from "~/routes/search/route";
import { LocationCardList } from "./partials/location-card-list.partial";
import { Search } from "./partials/locations-search-hero.partial";

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

let globalSearchClient: SearchClient | null = null;

export function LocationSearchPage() {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const algolia = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = algolia;

  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(null);

  const campusScrollUsesNavbarOffsetRef = useRef(false);
  const desktopAutoGeolocationAttemptedRef = useRef(false);
  const { isLarge } = useResponsive();

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
  const googleFetcher = useFetcher();

  const handleSearch = (query: string | null) => {
    if (!query) {
      setSearchCoordinates(null);
      return;
    }
    const formData = new FormData();
    formData.append("address", query);
    geocodeFetcher.submit(formData, {
      method: "post",
      action: "/google-geocode",
    });
  };

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
    getCurrentPositionFromUserGesture(
      (position) => {
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
  }, [isLarge, setSearchCoordinates]);

  const scrollCampusesIntoView = useCallback(() => {
    const campusesSection = document.getElementById("campuses");
    if (!campusesSection) {
      return;
    }
    const offsetPx = campusScrollUsesNavbarOffsetRef.current
      ? ANCHOR_SCROLL_OFFSET
      : 0;
    const offsetTop =
      campusesSection.getBoundingClientRect().top +
      window.scrollY -
      offsetPx;
    window.scrollTo({
      top: Math.max(0, offsetTop),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (geocodeFetcher.data?.results?.[0]?.geometry?.location) {
      campusScrollUsesNavbarOffsetRef.current = true;
      const { lat, lng } = geocodeFetcher.data.results[0].geometry.location;
      setCoordinates({ lat, lng });
    }
  }, [geocodeFetcher.data]);

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

  return (
    <div className="flex w-full flex-col">
      {/* Add Algolia Wrapper */}
      <InstantSearch
        indexName="dev_Locations"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        initialUiState={{
          dev_Locations: {
            query: "",
          },
        }}
        insights={false}
      >
        <Configure
          hitsPerPage={20}
          aroundLatLng={
            coordinates?.lat && coordinates?.lng
              ? `${coordinates.lat}, ${coordinates.lng}`
              : undefined
          }
          aroundRadius="all"
          aroundLatLngViaIP={false}
          getRankingInfo={true}
        />

        <Search
          handleSearch={handleSearch}
          setCoordinates={setSearchCoordinates}
        />
        <LocationCardList loading={googleFetcher.state === "loading"} />
      </InstantSearch>
    </div>
  );
}
