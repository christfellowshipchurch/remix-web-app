import { algoliasearch, SearchClient } from "algoliasearch";
import { useEffect, useRef } from "react";
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
    <div className="w-full p-4 md:p-6">
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

  const { isSmall, isMedium } = useResponsive();
  const getHitsPerPage = () => {
    switch (true) {
      case isMedium:
        return 8;
      case isSmall:
        return 6;
      default:
        return 6;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white relative">
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
        <Configure hitsPerPage={getHitsPerPage()} />

        {/* Search Bar */}
        <div className="flex w-full items-center p-3 gap-2">
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

        {/* Search Results + Refinements */}
        <SearchPopup />
      </InstantSearch>
    </div>
  );
};
