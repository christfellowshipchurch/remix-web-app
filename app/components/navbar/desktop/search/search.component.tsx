import React from "react";
import { algoliasearch, SearchClient } from "algoliasearch";
import { useEffect, useRef } from "react";
import {
  Configure,
  InstantSearch,
  SearchBox,
  useSearchBox,
} from "react-instantsearch";
import { useRouteLoaderData } from "react-router-dom";
import Icon from "~/primitives/icon";
import { SearchPopup } from "./search-popup.component";
import { RootLoaderData } from "~/routes/navbar/loader";

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
          index: "dev_contentItems",
        },
      ],
    }),
};

// Create a component to provide the current query and searchClient
function CurrentQueryProvider({
  children,
  searchClient,
}: {
  children: React.ReactNode;
  searchClient: SearchClient | { search: () => Promise<unknown> };
}) {
  const { query } = useSearchBox();

  // Clone the children with the current query and searchClient props
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(
        child as React.ReactElement<{
          query?: string;
          searchClient?: SearchClient | { search: () => Promise<unknown> };
        }>,
        { query, searchClient }
      );
    }
    return child;
  });
}

export const SearchBar = ({
  mode,
  isSearchOpen,
  setIsSearchOpen,
}: {
  mode: "light" | "dark";
  isSearchOpen: boolean;
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) => {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const algolia = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = algolia;

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

  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isSearchOpen) return;

      const target = event.target as HTMLElement;

      // Don't close if clicking inside search bar
      if (searchBarRef.current?.contains(target as Node)) return;

      // Don't close if clicking inside search popup
      const searchPopup = document.querySelector(".popup-search-container");
      if (searchPopup?.contains(target as Node)) return;

      // Don't close if clicking on search button (to toggle)
      const isSearchButton = target
        .closest("button")
        ?.querySelector('svg[name="search"]');
      if (isSearchButton) return;

      // Don't close if clicking on Algolia search elements
      const isAlgoliaElement = [
        "ais-Hits",
        "ais-RefinementList",
        "ais-SearchBox",
      ].some((className) => target.closest(`.${className}`));
      if (isAlgoliaElement) return;

      // Close search for all other clicks (including navbar but outside search)
      setIsSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSearchOpen, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      // Fade in the search popup
      const searchPopup = document.querySelector(
        ".popup-search-container"
      ) as HTMLDivElement;
      if (searchPopup) {
        searchPopup.style.maxHeight = "0";
        searchPopup.style.paddingTop = "0";
        setTimeout(() => {
          searchPopup.style.maxHeight = "700px";
          searchPopup.style.paddingTop = "16px";
        }, 0);
      }
    }
  }, [isSearchOpen]);

  return (
    <div className="relative size-full" ref={searchBarRef}>
      <InstantSearch
        indexName="dev_contentItems"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        initialUiState={{
          dev_contentItems: {
            query: "",
          },
          dev_Locations: {
            query: "",
          },
        }}
        insights={false}
        key={SEARCH_INSTANCE_ID}
      >
        <Configure hitsPerPage={10} />

        <div className="flex w-full items-center pb-2 border-b border-neutral-lighter gap-4">
          <button
            onClick={() => {
              setIsSearchOpen(false);
            }}
            className="flex items-center"
          >
            <Icon
              name="search"
              size={20}
              className={`text-ocean hover:text-neutral-default transition-colors cursor-pointer`}
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
        <CurrentQueryProvider searchClient={searchClient}>
          <SearchPopup setIsSearchOpen={setIsSearchOpen} />
        </CurrentQueryProvider>
      </InstantSearch>
    </div>
  );
};
