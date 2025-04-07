import { algoliasearch, SearchClient } from "algoliasearch";
import { useEffect, useState } from "react";
import {
  Configure,
  Hits,
  InstantSearch,
  SearchBox,
  useSearchBox,
} from "react-instantsearch";
import { useFetcher } from "react-router";
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

export const MobileSearch = ({
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

  return (
    <div className="h-full overflow-y-auto bg-white">
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
        <Configure hitsPerPage={12} />

        {/* Search Bar */}
        <div className="flex w-full items-center pt-6 px-4 gap-3">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="flex items-center md:hidden"
          >
            <Icon
              name="arrowBack"
              size={20}
              className={`text-black hover:text-neutral-default transition-colors cursor-pointer
        `}
            />
          </button>
          <SearchBox
            classNames={{
              root: "flex-grow",
              form: "flex",
              input: `w-full justify-center bg-[#F4F2F5] rounded-lg py-2 px-1 text-[#2F2F2F] px-3 outline-none appearance-none`,
              reset: "hidden",
              resetIcon: "hidden",
              submit: "hidden",
            }}
          />
        </div>

        {/* Search Results + Refinements */}
        <SearchPopup setIsSearchOpen={setIsSearchOpen} />
      </InstantSearch>
    </div>
  );
};
