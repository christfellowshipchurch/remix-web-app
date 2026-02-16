import { algoliasearch } from "algoliasearch";
import { useState, useMemo } from "react";
import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { LoaderReturnType } from "../loader";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { AllClassFiltersPopup } from "~/routes/class-finder/finder/components/popups/all-filters.component";
import { Button } from "~/primitives/button/button.primitive";

import { Hits, InstantSearch, Stats } from "react-instantsearch";
import { UpcomingSessionCard } from "../components/upcoming-sessions/upcoming-session-card.component";
import { FindersCustomPagination } from "~/routes/group-finder/components/finders-custom-pagination.component";
import { ResponsiveClassesSingleConfigure } from "./upcoming-sections.partial";
import {
  parseClassSingleUrlState,
  classSingleUrlStateToParams,
  classSingleEmptyState,
  type ClassSingleUrlState,
} from "../class-single-url-state";
import { useAlgoliaUrlSync } from "~/hooks/use-algolia-url-sync";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";

const INDEX_NAME = "dev_Classes";

function getInitialStateFromUrl(searchParams: URLSearchParams) {
  const urlState = parseClassSingleUrlState(searchParams);
  const initialUiState: { [key: string]: Record<string, unknown> } = {};
  if (
    urlState.query !== undefined ||
    (urlState.refinementList && Object.keys(urlState.refinementList).length > 0)
  ) {
    initialUiState[INDEX_NAME] = {};
    if (urlState.query !== undefined)
      initialUiState[INDEX_NAME].query = urlState.query;
    if (
      urlState.refinementList &&
      Object.keys(urlState.refinementList).length > 0
    ) {
      initialUiState[INDEX_NAME].refinementList = urlState.refinementList;
    }
  }
  return { coordinates: null, initialUiState };
}

export function UpcomingSessionMobileSection() {
  const { classUrl, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { debouncedUpdateUrl, cancelDebounce } = useAlgoliaUrlSync({
    searchParams,
    setSearchParams,
    toParams: classSingleUrlStateToParams,
    debounceMs: 400,
  });

  const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [instantSearchKey, setInstantSearchKey] = useState(0);

  const clearAllFiltersFromUrl = () => {
    cancelDebounce();
    setSearchParams(classSingleUrlStateToParams(classSingleEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
    setInstantSearchKey((k) => k + 1);
  };

  const syncUrlFromUiState = (indexUiState: Record<string, unknown>) => {
    const urlState: ClassSingleUrlState = {
      ...parseClassSingleUrlState(searchParams),
      query: (indexUiState.query as string) ?? undefined,
      refinementList:
        (indexUiState.refinementList as Record<string, string[]>) ?? undefined,
    };
    debouncedUpdateUrl(urlState);
  };

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseClassSingleUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const initialUiState =
    instantSearchKey > 0
      ? { [INDEX_NAME]: {} }
      : Object.keys(initial.initialUiState).length > 0
      ? initial.initialUiState
      : undefined;

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  return (
    <div className="flex md:hidden flex-col gap-4 max-w-screen-content mx-auto pagination-scroll-to">
      <div className="flex items-center gap-4 w-fit content-padding">
        <h2 className="text-[28px] font-extrabold w-fit min-w-[260px]">
          Upcoming Sessions
        </h2>
      </div>

      <div
        className="flex flex-col gap-4 w-screen pagination-scroll-to"
        id="search"
      >
        <InstantSearch
          key={instantSearchKey}
          indexName={INDEX_NAME}
          searchClient={searchClient}
          initialUiState={initialUiState}
          onStateChange={({ uiState }) => {
            const indexState = uiState[INDEX_NAME];
            if (indexState)
              syncUrlFromUiState(indexState as Record<string, unknown>);
          }}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <ResponsiveClassesSingleConfigure
            classUrl={classUrl}
            selectedLocation={null}
          />
          <div className="flex flex-col">
            <div className="bg-white pb-5 border-b-2 border-black/10 border-solid select-none">
              <div className="content-padding">
                <Button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  intent="secondary"
                  className="flex items-center gap-2 border-2 px-8 w-full text-text-primary rounded-lg"
                >
                  <Icon name="sliderAlt" className="text-navy" />
                  All Filters
                </Button>
              </div>

              <div
                className={cn(
                  "absolute transition-all duration-300",
                  isMobileOpen
                    ? "z-4 opacity-100 top-[calc(99%)]"
                    : "-z-1 opacity-0 pointer-events-none"
                )}
              >
                <AllClassFiltersPopup
                  hideTopic={true}
                  onHide={() => setIsMobileOpen(false)}
                  onClearAllToUrl={clearAllFiltersFromUrl}
                />
              </div>
            </div>

            {/* Class Search Results / Class Type Filters */}
            <div className="flex flex-col bg-gray py-8 w-full content-padding">
              <div className="max-w-screen-content mx-auto ">
                <div className="flex flex-col bg-gray py-8 w-full content-padding">
                  <div className="max-w-screen-content mx-auto">
                    <Stats
                      classNames={{
                        root: "text-text-secondary mb-6",
                      }}
                      translations={{
                        rootElementText: ({ nbHits }) =>
                          `${nbHits.toLocaleString()} Results Found`,
                      }}
                    />

                    <Hits
                      classNames={{
                        root: "flex items-center justify-center w-full",
                        item: "flex items-center justify-center w-full",
                        list: "grid sm:grid-cols-2 gap-x-4 xl:!gap-x-8 gap-y-6 w-full",
                      }}
                      hitComponent={UpcomingSessionCard}
                    />
                    <div className="mt-6 flex justify-center">
                      <FindersCustomPagination />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}
