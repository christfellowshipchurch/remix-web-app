import { useLoaderData, useSearchParams } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Hits, Stats, Configure } from "react-instantsearch";

import { cn } from "~/lib/utils";
import { LoaderReturnType } from "../loader";
import { useState, useMemo } from "react";
import { UpcomingSessionCard } from "../components/upcoming-sessions/upcoming-session-card.component";
import { FindersCustomPagination } from "~/routes/group-finder/components/finders-custom-pagination.component";

import { useResponsive } from "~/hooks/use-responsive";
import { UpcomingSessionFilters } from "../components/upcoming-sessions/upcoming-session-filters.component";
import {
  parseClassSingleUrlState,
  classSingleUrlStateToParams,
  classSingleEmptyState,
  type ClassSingleUrlState,
} from "../class-single-url-state";
import { useAlgoliaUrlSync } from "~/hooks/use-algolia-url-sync";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";
import { AlgoliaFinderClearAllButton } from "~/routes/group-finder/components/clear-all-button.component";

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

export const UpcomingSessionsSection = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, classUrl } =
    useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { debouncedUpdateUrl, cancelDebounce } = useAlgoliaUrlSync({
    searchParams,
    setSearchParams,
    toParams: classSingleUrlStateToParams,
    debounceMs: 400,
  });

  const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);

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
    <div
      className="hidden md:flex flex-col gap-4 w-full pt-12 relative"
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
          selectedLocation={null}
          classUrl={classUrl}
        />
        <div className="flex flex-col">
          {/* Filters Section */}
          <div
            className={cn(
              "bg-white content-padding md:shadow-sm select-none transition-all duration-300",
              "relative z-10"
            )}
          >
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-4 py-4 max-w-screen-content mx-auto lg:h-20 pagination-scroll-to">
              {/* Title */}
              <div className="flex items-center gap-4 w-fit">
                <h2 className="text-[28px] font-extrabold w-fit min-w-[260px]">
                  Upcoming Sessions
                </h2>
                <div className="hidden lg:block h-full w-[1px] bg-text-secondary" />
              </div>

              <div className="flex flex-row gap-4 w-fit overflow-x-visible scrollbar-hide relative items-center">
                <UpcomingSessionFilters />
                <AlgoliaFinderClearAllButton
                  onClearAllToUrl={clearAllFiltersFromUrl}
                />
              </div>
            </div>
          </div>

          {/* Session Results & Pagination */}
          <div className="flex flex-col bg-gray pt-12 pb-20 w-full content-padding">
            <div className="max-w-screen-content mx-auto w-full">
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
                  root: "flex items-center items-start justify-start w-full",
                  item: "flex items-center items-start justify-start w-full",
                  list: "grid grid-cols-3 lg:grid-cols-4 gap-x-4 xl:!gap-x-8 gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1296px]",
                }}
                hitComponent={UpcomingSessionCard}
              />
              <div className="mt-6 flex justify-start">
                <FindersCustomPagination />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

export const ResponsiveClassesSingleConfigure = ({
  selectedLocation,
  classUrl,
}: {
  selectedLocation: string | null;
  classUrl: string;
}) => {
  const { isSmall, isMedium, isLarge, isXLarge } = useResponsive();

  const hitsPerPage = (() => {
    switch (true) {
      case isXLarge || isLarge:
        return 12;
      case isMedium:
        return 9;
      case isSmall:
        return 5;
      default:
        return 5;
    }
  })();

  // Build filters array
  const filters = [];
  if (selectedLocation) {
    filters.push(`campusName:'${selectedLocation}'`);
  }
  if (classUrl) {
    filters.push(`classTypeUrl:"${classUrl}"`);
  }

  return (
    <Configure
      key={`${selectedLocation}-${classUrl}`}
      hitsPerPage={hitsPerPage}
      filters={filters.length > 0 ? filters.join(" AND ") : undefined}
    />
  );
};
