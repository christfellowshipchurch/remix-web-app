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
import { SearchPopup } from "./search-popup.component";

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

  const { isSmall, isMedium } = useResponsive();
  const getHitsPerPage = () => {
    switch (true) {
      case isMedium:
        return 8;
      case isSmall:
        return 6;
      default:
        return 8;
    }
  };

  const searchBarRef = useRef<HTMLDivElement>(null);

  // Handle click outside with a slight delay to allow search interactions
  useEffect(() => {
    let clickTimeout: NodeJS.Timeout;

    const handleClickOutside = (event: MouseEvent) => {
      // Clear any pending timeout
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }

      // Add a small delay to prevent race conditions with the search icon click
      clickTimeout = setTimeout(() => {
        // Check if click is outside the search bar
        if (
          searchBarRef.current &&
          !searchBarRef.current.contains(event.target as Node)
        ) {
          // Get the clicked element
          const target = event.target as HTMLElement;

          // Also check if this is the search icon button in the navbar
          const isSearchButton = target
            .closest("button")
            ?.querySelector('svg[name="search"]');

          // Don't close search if clicking algolia-related elements or the search button
          const isAlgoliaElement =
            target.closest(".ais-Hits") ||
            target.closest(".ais-RefinementList") ||
            target.closest(".ais-SearchBox") ||
            isSearchButton;

          if (!isAlgoliaElement) {
            setIsSearchOpen(false);
          }
        }
      }, 150); // Increased delay to ensure proper event handling
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
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
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchOpen(false);
            }}
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
        <SearchPopup setIsSearchOpen={setIsSearchOpen} />
      </InstantSearch>
    </div>
  );
};
