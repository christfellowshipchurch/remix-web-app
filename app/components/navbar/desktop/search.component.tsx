import { algoliasearch } from "algoliasearch";
import { useEffect } from "react";
import { Configure, Hits, InstantSearch, SearchBox } from "react-instantsearch";
import { useFetcher } from "react-router";
import { useResponsive } from "~/hooks/use-responsive";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { LoaderReturnType } from "~/routes/search/loader";
import { SearchCustomClearRefinements } from "./custom-clear-refinements.component";
import { HitComponent } from "./hit-component.component";

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

export const SearchPopup = () => {
  return (
    <div className="absolute left-0 top-[60px] w-full bg-[#F3F5FA] rounded-b-lg shadow-lg p-4">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xs text-[#2F2F2F] opacity-50 font-semibold">
            I'M LOOKING FOR
          </h2>
          <div className="flex flex-wrap gap-2 xl:gap-3 mt-4">
            {[
              "Events",
              "Articles",
              "Messages",
              "Pages",
              "People",
              "Podcasts",
            ].map((label) => (
              <Button
                key={label}
                size="md"
                intent="secondary"
                className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-6 space-y-4">
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

  const searchClient =
    ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY
      ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {})
      : emptySearchClient;

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

  return (
    <div className="relative size-full">
      <InstantSearch
        indexName="production_ContentItems"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure hitsPerPage={getHitsPerPage()} />
        <div className="flex w-full items-center border-b border-neutral-lighter pb-2">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="flex items-center"
          >
            <Icon
              name="search"
              size={20}
              className={`text-ocean
          ${
            mode === "light"
              ? "text-neutral-dark"
              : "text-white group-hover:text-text"
          } hover:text-neutral-dark transition-colors cursor-pointer
        `}
            />
          </button>
          <SearchBox
            translations={{
              submitButtonTitle: "Search",
              resetButtonTitle: "Reset",
            }}
            classNames={{
              root: "flex-grow",
              form: "flex pr-10 md:pr-24",
              input:
                "w-full justify-center text-black opacity-40 px-3 outline-none",
              resetIcon: "hidden",
              submit: "hidden",
            }}
          />
          <SearchCustomClearRefinements />
        </div>
        <SearchPopup />
      </InstantSearch>
    </div>
  );
};
