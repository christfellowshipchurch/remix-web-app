import { useRouteLoaderData } from "react-router";

import { useEffect, useRef, useCallback, useMemo } from "react";

import { algoliasearch, SearchClient } from "algoliasearch";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";

import { loader } from "~/routes/navbar/loader";
import Icon from "~/primitives/icon";

import { SearchPopup } from "./search-popup.component";

const SEARCH_INSTANCE_ID = "navbar-search";

let globalSearchClient: SearchClient | null = null;

const emptySearchClient = algoliasearch("empty", "empty");
emptySearchClient.search = () =>
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
  });

// --- Interfaces and types ---
interface SearchBarProps {
  mode: "light" | "dark";
  isSearchOpen: boolean;
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}

// --- Component ---
export const SearchBar = ({
  mode,
  isSearchOpen,
  setIsSearchOpen,
}: SearchBarProps) => {
  // Loader data
  const loaderData = useRouteLoaderData<typeof loader>("root");
  if (!loaderData) {
    console.error("Could not load Algolia config");
    return null;
  }
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = loaderData?.algolia;

  // Search client setup
  useEffect(() => {
    if (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY && !globalSearchClient) {
      globalSearchClient = algoliasearch(
        ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY,
        {}
      );
    }
  }, [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]);

  const searchClient = useMemo(
    () =>
      globalSearchClient ||
      (ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY
        ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {})
        : emptySearchClient),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  // Refs
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Event handlers
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (searchBarRef.current?.contains(target)) return;
      const isSearchButton = target
        .closest("button")
        ?.querySelector('svg[name="search"]');
      const isAlgoliaElement = [
        "ais-Hits",
        "ais-RefinementList",
        "ais-SearchBox",
      ].some((className) => target.closest(`.${className}`));
      if (!isSearchButton && !isAlgoliaElement) {
        setIsSearchOpen(false);
      }
    },
    [setIsSearchOpen]
  );

  // Effects
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isSearchOpen) {
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

  // Render
  return (
    <div className="relative size-full" ref={searchBarRef}>
      <InstantSearch
        indexName="production_ContentItems"
        searchClient={searchClient}
        future={{ preserveSharedStateOnUnmount: true }}
        initialUiState={{
          production_ContentItems: {
            query: "",
          },
        }}
        insights={false}
        key={SEARCH_INSTANCE_ID}
      >
        <Configure hitsPerPage={20} />
        <div className="flex w-full items-center pb-2 border-b border-neutral-lighter gap-4">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="flex items-center"
            aria-label="Close search"
            type="button"
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
        <SearchPopup setIsSearchOpen={setIsSearchOpen} />
      </InstantSearch>
    </div>
  );
};
