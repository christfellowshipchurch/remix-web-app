import { algoliasearch } from "algoliasearch";
import { useEffect, useRef, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch";
import { useFetcher, useLoaderData } from "react-router-dom";
import { SearchPopup } from "./search-popup";
import { cn } from "~/lib/utils";
import { emptySearchClient } from "~/routes/search/route";
import { globalSearchClient } from "~/routes/search/route";
import { SearchBar } from "./search-bar";
import { loader } from "~/routes/home/loader";

// This component is used to search for locations on the home page
export const LocationSearch = ({
  isSearching: controlledIsSearching,
  setIsSearching: controlledSetIsSearching,
}: {
  isSearching?: boolean;
  setIsSearching?: (isSearching: boolean) => void;
} = {}) => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<typeof loader>();
  const geocodeFetcher = useFetcher();

  const locationSearchBarRef = useRef<HTMLDivElement>(null);
  const [internalIsSearching, setInternalIsSearching] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isSearching = controlledIsSearching ?? internalIsSearching;
  const setIsSearching = controlledSetIsSearching ?? setInternalIsSearching;
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Create or retrieve the Algolia client
  useEffect(() => {
    if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY && !globalSearchClient) {
      // const newSearchClient = algoliasearch(
      //   ALGOLIA_APP_ID,
      //   ALGOLIA_SEARCH_API_KEY,
      //   {}
      // );
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string | null) => {
    if (!query) {
      setCoordinates(null);
      return;
    }
    const formData = new FormData();
    formData.append("address", query);
    geocodeFetcher.submit(formData, {
      method: "post",
      action: "/google-geocode",
    });
  };

  // Set the coordinates to the user's current location
  useEffect(() => {
    if (useCurrentLocation) {
      // Get the current location
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });

      setUseCurrentLocation(false);
    }
  }, [useCurrentLocation]);

  useEffect(() => {
    if (geocodeFetcher.data?.results?.[0]?.geometry?.location) {
      const { lat, lng } = geocodeFetcher.data.results[0].geometry.location;
      setCoordinates({ lat, lng });
    }
  }, [geocodeFetcher.data]);

  return (
    <div className={cn(isSearching && "mt-32")} ref={locationSearchBarRef}>
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
        {coordinates?.lat && coordinates?.lng ? (
          <Configure
            hitsPerPage={20}
            aroundLatLng={`${coordinates.lat}, ${coordinates.lng}`}
            aroundRadius="all"
            aroundLatLngViaIP={false}
            getRankingInfo={true}
          />
        ) : (
          <Configure hitsPerPage={20} />
        )}

        {/* Search Bar */}
        <div
          className={cn(
            "relative w-full md:w-90 z-50 rounded-[1rem] transition-all duration-300",
            {
              "bg-white p-4 shadow-md sm:w-[450px] md:w-[620px] lg:w-[430px] lg:-translate-y-30 shorter:-translate-y-70":
                isSearching,
              "bg-transparent": !isSearching,
            }
          )}
        >
          <SearchBar
            onSearchStateChange={setIsSearching}
            onSearchSubmit={handleSearch}
            data-gtm="hero-cta"
          />
          {isSearching && (
            <SearchPopup setUseCurrentLocation={setUseCurrentLocation} />
          )}
        </div>
      </InstantSearch>
    </div>
  );
};
