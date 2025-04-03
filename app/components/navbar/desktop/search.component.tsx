import { algoliasearch, SearchClient } from "algoliasearch";
import { useEffect, useRef, useState } from "react";
import {
  Configure,
  Hits,
  InstantSearch,
  RefinementList,
  SearchBox,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { useFetcher } from "react-router";
import { useResponsive } from "~/hooks/use-responsive";
import Icon from "~/primitives/icon";
import { LoaderReturnType } from "~/routes/search/loader";
import { HitComponent } from "./hit-component.component";

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

// Virtual component to maintain search state
export function VirtualSearchBox() {
  useSearchBox();
  return null;
}

export const SearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  return (
    <RefinementList
      classNames={{
        list: "flex flex-wrap gap-2",
        checkbox: "hidden",
        count: "hidden",
        item: "flex items-center justify-center text-center text-xs border-[#AAAAAA] text-[#444444] border-[0.7px] px-4 py-2 whitespace-nowrap rounded-md hover:bg-oceanSubdued hover:text-ocean hover:border-ocean transition-all duration-300",
        selectedItem: "bg-oceanSubdued text-ocean border-ocean overflow-hidden",
        label:
          "flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer",
      }}
      attribute={attribute}
    />
  );
};

export const SearchPopup = () => {
  return (
    <div className="absolute left-0 top-[52px] w-full bg-[#F3F5FA] rounded-b-lg shadow-lg px-12 py-4 z-4">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs text-[#2F2F2F] opacity-50 font-semibold">
            I'M LOOKING FOR
          </h2>
          <SearchCustomRefinementList attribute="contentType" />
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-2 space-y-4">
        <Hits
          classNames={{
            item: "flex",
            list: "grid md:grid-cols-1 gap-4",
          }}
          hitComponent={HitComponent}
        />
      </div>
    </div>
  );
};

// Component to save search state on unmount
function SearchStateManager() {
  const { uiState, setUiState } = useInstantSearch();
  const uiStateRef = useRef(uiState);

  // Keep uiState reference up to date
  useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);

  // Save state on unmount
  useEffect(() => {
    return () => {
      try {
        // Need setTimeout to ensure it runs after other cleanup
        setTimeout(() => setUiState(uiStateRef.current), 0);
      } catch (e) {
        console.error("Failed to preserve search state:", e);
      }
    };
  }, [setUiState]);

  return null;
}

export const SearchBar = ({
  mode,
  setIsSearchOpen,
}: {
  mode: "light" | "dark";
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) => {
  const fetcher = useFetcher<LoaderReturnType>();
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = fetcher.data || {};

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

  const { isSmall, isMedium, isLarge } = useResponsive();
  const getHitsPerPage = () => {
    switch (true) {
      case isLarge:
        return 10;
      case isMedium:
        return 8;
      case isSmall:
        return 6;
      default:
        return 6;
    }
  };

  const searchBarRef = useRef<HTMLDivElement>(null);

  // Handle click outside with a slight delay to allow search interactions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the search bar
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        // Get the clicked element
        const target = event.target as HTMLElement;

        // Don't close search if clicking algolia-related elements (hits, refinements, etc.)
        const isAlgoliaElement =
          target.closest(".ais-Hits") ||
          target.closest(".ais-RefinementList") ||
          target.closest(".ais-SearchBox");

        if (!isAlgoliaElement) {
          // Use setTimeout to allow interactions to complete
          setTimeout(() => {
            setIsSearchOpen(false);
          }, 100);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSearchOpen]);

  return (
    <div className="relative size-full" ref={searchBarRef}>
      <InstantSearch
        indexName="production_ContentItems"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        initialUiState={{
          production_ContentItems: {
            query: "",
          },
        }}
        insights={false}
        key={SEARCH_INSTANCE_ID}
      >
        <SearchStateManager />
        <VirtualSearchBox />
        <Configure hitsPerPage={getHitsPerPage()} />

        <div className="flex w-full items-center pb-2 border-b border-neutral-lighter gap-4">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="flex items-center"
          >
            <Icon
              name="search"
              size={20}
              className={`text-ocean hover:text-neutral-default transition-colors cursor-pointer
        `}
            />
          </button>
          <SearchBox
            classNames={{
              root: "flex-grow",
              form: "flex",
              input: `w-full justify-center ${
                mode === "light"
                  ? "text-[#2F2F2F]"
                  : "text-white group-hover:text-[#2F2F2F]"
              } px-3 outline-none appearance-none`,
              reset: "hidden",
              resetIcon: "hidden",
              submit: "hidden",
            }}
          />
        </div>
        <SearchPopup />
      </InstantSearch>
    </div>
  );
};
