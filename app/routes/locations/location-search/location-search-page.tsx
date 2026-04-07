import { useFetcher, useRouteLoaderData } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { algoliasearch, SearchClient } from "algoliasearch";
import { Configure, InstantSearch } from "react-instantsearch";

import { ANCHOR_SCROLL_OFFSET } from "~/components/navbar/scroll-offset.constants";
import { RootLoaderData } from "~/routes/navbar/loader";
import { emptySearchClient } from "~/routes/search/route";
import { LocationCardList } from "./partials/location-card-list.partial";
import { LocationSearchBootSkeleton } from "./components/location-search-boot-skeleton.partial";
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

const LOCATION_SEARCH_INDEX_NAME = "dev_Locations";

function LocationSearchIndexBody({
  coordinates,
  setSearchCoordinates,
  handleSearch,
  geocodeLoading,
}: {
  coordinates: { lat: number | null; lng: number | null } | null;
  setSearchCoordinates: (
    next: { lat: number | null; lng: number | null } | null,
    options?: { scrollWithNavbarOffset?: boolean },
  ) => void;
  handleSearch: (query: string | null) => void;
  geocodeLoading: boolean;
}) {
  return (
    <>
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
      <LocationCardList loading={geocodeLoading} />
    </>
  );
}

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

  const handleSearch = useCallback(
    (query: string | null) => {
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
    },
    [setSearchCoordinates, geocodeFetcher],
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

  const scrollCampusesIntoView = useCallback(() => {
    const campusesSection = document.getElementById("campuses");
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
          "searchSingleIndex" in client &&
          typeof (client as SearchClient).searchSingleIndex === "function"
        ) {
          await (client as SearchClient).searchSingleIndex({
            indexName: LOCATION_SEARCH_INDEX_NAME,
            searchParams: { hitsPerPage: 1, query: "" },
          });
        } else if ("search" in client && typeof client.search === "function") {
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
    <div className="flex w-full flex-col min-h-screen">
      {!algoliaBootstrapped ? (
        <LocationSearchBootSkeleton />
      ) : (
        <InstantSearch
          indexName={LOCATION_SEARCH_INDEX_NAME}
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          initialUiState={{
            [LOCATION_SEARCH_INDEX_NAME]: {
              query: "",
            },
          }}
          insights={false}
        >
          <LocationSearchIndexBody
            coordinates={coordinates}
            setSearchCoordinates={setSearchCoordinates}
            handleSearch={handleSearch}
            geocodeLoading={googleFetcher.state === "loading"}
          />
        </InstantSearch>
      )}
    </div>
  );
}
