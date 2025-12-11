import { algoliasearch, SearchClient } from "algoliasearch";
import { useEffect } from "react";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import { useRouteLoaderData } from "react-router-dom";
import Icon from "~/primitives/icon";
import { SearchPopup } from "./search-popup.component";
import { RootLoaderData } from "~/routes/navbar/loader";
import { MobileSearchCustomRefinementList } from "./customRefinements.component";

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

export const MobileSearch = ({
  setIsSearchOpen,
}: {
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) => {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };

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
        <Configure hitsPerPage={9} />

        <div className="flex flex-col gap-6 pb-2 sticky top-0 bg-white shadow-sm border-b border-[#E0E0E0]">
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

          <div className="flex flex-col gap-2 w-full">
            <MobileSearchCustomRefinementList attribute="contentType" />
          </div>
        </div>

        {/* Search Results + Refinements */}
        <SearchPopup setIsSearchOpen={setIsSearchOpen} />
      </InstantSearch>
    </div>
  );
};
