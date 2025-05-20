import { useState } from "react";
import { algoliasearch, SearchClient } from "algoliasearch";
import { useEffect, useRef } from "react";
import {
  Configure,
  InstantSearch,
  SearchBox,
  useSearchBox,
} from "react-instantsearch";
import { useFetcher } from "react-router";
import Icon from "~/primitives/icon";
import { LoaderReturnType } from "~/routes/search/loader";
import { SearchPopup } from "./search-popup.component";
import { cn } from "~/lib/utils";

// Create a stable search instance ID that persists between unmounts
const SEARCH_INSTANCE_ID = "navbar-search";

// Global reference to maintain Algolia search client instance
let globalSearchClient: SearchClient | null = null;

const emptySearchClient = {
  search: () =>
    Promise.resolve({
      results: [
        {
          hits: [],
          nbHits: 0,
          page: 0,
          nbPages: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: true,
          query: "",
          params: "",
          processingTimeMS: 0,
          index: "production_ContentItems",
        },
      ],
    }),
};

const SearchBar = ({
  onSearchStateChange,
  onSearchSubmit,
}: {
  onSearchStateChange: (isSearching: boolean) => void;
  onSearchSubmit: (query: string | null) => void;
}) => {
  const { query } = useSearchBox();

  useEffect(() => {
    onSearchStateChange(!!query);

    if (query.length === 5 && /^\d+$/.test(query)) {
      onSearchSubmit(query);
    } else {
      onSearchSubmit(null);
    }
  }, [query, onSearchStateChange]);

  return (
    <div
      className={cn(
        "flex w-full items-center gap-4 rounded-full p-1",
        query ? "bg-gray" : "bg-white"
      )}
    >
      <button
        type="submit"
        className="flex items-center justify-center p-2 bg-dark-navy rounded-full relative"
      >
        <Icon
          name="search"
          size={20}
          className={`text-white cursor-pointer relative right-[1px] bottom-[1px]`}
        />
      </button>

      <SearchBox
        placeholder="Search by city, zip code, or location"
        classNames={{
          root: "flex-grow w-full max-w-98",
          form: "flex",
          input: `w-full justify-center text-black px-3 outline-none appearance-none`,
          reset: "hidden",
          resetIcon: "hidden",
          submit: "hidden",
        }}
      />
    </div>
  );
};

export const HomeSearch = () => {
  const fetcher = useFetcher<LoaderReturnType>();
  const geocodeFetcher = useFetcher();
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = fetcher.data || {};
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!fetcher.data) {
      fetcher.load("/search");
    }
  }, [fetcher]);

  // Create or retrieve the Algolia client
  useEffect(() => {
    if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY && !globalSearchClient) {
      globalSearchClient = algoliasearch(
        ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY,
        {}
      );
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
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleZipCode = (query: string | null) => {
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

  useEffect(() => {
    if (geocodeFetcher.data?.results?.[0]?.geometry?.location) {
      const { lat, lng } = geocodeFetcher.data.results[0].geometry.location;
      setCoordinates({ lat, lng });
    }
  }, [geocodeFetcher.data]);

  console.log(coordinates);
  return (
    <div
      className="relative size-full md:size-auto lg:size-full flex flex-col justify-end md:justify-start"
      ref={searchBarRef}
    >
      <div className="h-[1px] w-full bg-[#D9D9D9] opacity-50 md:hidden" />
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
        key={SEARCH_INSTANCE_ID}
      >
        {coordinates?.lat && coordinates?.lng ? (
          <Configure
            hitsPerPage={20}
            aroundLatLng={`${coordinates.lat}, ${coordinates.lng}`}
            aroundLatLngViaIP={!coordinates}
          />
        ) : (
          <Configure hitsPerPage={20} />
        )}

        {/* Search Bar */}
        <div
          className={cn(
            "relative w-full md:w-90 lg:w-98 pt-4 rounded-[8px] transition-all duration-300",
            {
              "bg-white p-4": isSearching,
              "bg-transparent": !isSearching,
            }
          )}
        >
          <SearchBar
            onSearchStateChange={setIsSearching}
            onSearchSubmit={handleZipCode}
          />
          {isSearching && <SearchPopup />}
        </div>
      </InstantSearch>
    </div>
  );
};
