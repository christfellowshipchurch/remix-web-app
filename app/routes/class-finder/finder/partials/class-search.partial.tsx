import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, useHits } from "react-instantsearch";

import Icon from "~/primitives/icon";

import { LoaderReturnType } from "../loader";
import { ClassHitComponent } from "../components/class-hit-component.component";
import { AllClassFiltersPopup } from "../components/popups/all-filters.component";
import { cn } from "~/lib/utils";
import { ResponsiveConfigure } from "~/routes/group-finder/partials/group-search.partial";
import { SearchFilters } from "~/components/finders/search-filters";
import { CLASS_SEARCH_DESKTOP_FILTERS } from "../class-search-filters.data";
import { ClassHitType } from "../../types";
import {
  parseClassFinderUrlState,
  classFinderUrlStateToParams,
  classFinderEmptyState,
  type ClassFinderUrlState,
} from "../../class-finder-url-state";
import {
  groupClassTypeHits,
  syntheticHitsFromGrouped,
} from "../components/group-class-type-hits";
import { useAlgoliaUrlSync } from "~/hooks/use-algolia-url-sync";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";
import { ActiveFilters } from "~/components/finders/search-filters/active-filter.component";
import { useStickyTopBelowNavbarClass } from "~/hooks/use-sticky-top-below-navbar";

const INDEX_NAME = "dev_Classes";

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md — Pattern A step 2. */
function getInitialStateFromUrl(searchParams: URLSearchParams) {
  const urlState = parseClassFinderUrlState(searchParams);
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

export const ClassSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const stickyTopClass = useStickyTopBelowNavbarClass();

  const { debouncedUpdateUrl, cancelDebounce } = useAlgoliaUrlSync({
    searchParams,
    setSearchParams,
    toParams: classFinderUrlStateToParams,
    debounceMs: 400,
  });

  const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {},
  );

  const clearAllFiltersFromUrl = () => {
    cancelDebounce();
    setSearchParams(classFinderUrlStateToParams(classFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
  };

  const syncUrlFromUiState = (indexUiState: Record<string, unknown>) => {
    const urlState: ClassFinderUrlState = {
      ...parseClassFinderUrlState(searchParams),
      query: (indexUiState.query as string) ?? undefined,
      refinementList:
        (indexUiState.refinementList as Record<string, string[]>) ?? undefined,
    };
    debouncedUpdateUrl(urlState);
  };

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseClassFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const fromClassFinderUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return (
    <div
      className="flex w-full min-w-0 max-w-full flex-col gap-4 pagination-scroll-to"
      id="search"
    >
      <InstantSearch
        indexName={INDEX_NAME}
        searchClient={searchClient}
        initialUiState={
          Object.keys(initial.initialUiState).length > 0
            ? initial.initialUiState
            : undefined
        }
        onStateChange={({ uiState, setUiState }) => {
          // Controlled InstantSearch: commit widget/programmatic UI state to the
          // helper + schedule search. Without this, URL can update while hits stay stale.
          setUiState(uiState);
          const indexState = uiState[INDEX_NAME];
          if (indexState)
            syncUrlFromUiState(indexState as Record<string, unknown>);
        }}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <ResponsiveConfigure
          ageInput=""
          selectedLocation={null}
          coordinates={null}
          hitsPerPageOverride={1000}
        />
        <div className="flex flex-col">
          <div
            className={cn(
              "sticky z-20 border-b border-black/5 bg-white shadow-sm content-padding select-none transition-all duration-300",
              stickyTopClass,
            )}
          >
            <div className="mx-auto flex max-w-screen-content flex-col gap-3 pt-8 pb-4 md:flex-row md:items-center md:gap-4">
              <div className="w-full md:w-[240px] lg:w-[250px] xl:w-[266px] flex items-center rounded-lg border border-[#DEE0E3] focus-within:border-ocean py-2">
                <Icon
                  name="searchAlt"
                  className="text-neutral-default ml-3"
                  size={16}
                />
                <SearchBox
                  placeholder="Search"
                  translations={{
                    submitButtonTitle: "Search",
                    resetButtonTitle: "Reset",
                  }}
                  classNames={{
                    root: "flex-grow",
                    form: "flex",
                    input:
                      "w-full text-sm text-neutral-default placeholder:text-neutral-default px-2 py-1 focus:outline-none",
                    resetIcon: "hidden",
                    submit: "hidden",
                    loadingIcon: "hidden",
                  }}
                />
              </div>

              <SearchFilters
                onClearAllToUrl={clearAllFiltersFromUrl}
                desktopFilters={CLASS_SEARCH_DESKTOP_FILTERS}
                compactInlineFilterCount={2}
                renderMorePanel={({ onHide, onClearAllToUrl }) => (
                  <AllClassFiltersPopup
                    hideTopic
                    hideLanguage
                    showFormat
                    onHide={onHide}
                    onClearAllToUrl={onClearAllToUrl}
                  />
                )}
              />
            </div>
            <ActiveFilters onClearAllToUrl={clearAllFiltersFromUrl} />
          </div>

          {/* CLASS SEARCH RESULTS */}
          <div className="flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding">
            <div className="max-w-screen-content mx-auto md:w-full">
              <ClassTypeGroupedResults
                fromClassFinderUrl={fromClassFinderUrl}
              />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

const ITEMS_PER_PAGE = 12;

function ClassTypeGroupedResults({
  fromClassFinderUrl,
}: {
  fromClassFinderUrl?: string;
}) {
  const { items } = useHits<ClassHitType>();
  const [currentPage, setCurrentPage] = useState(1);

  const grouped = useMemo(() => groupClassTypeHits(items), [items]);
  const mappedHits = useMemo(
    () => syntheticHitsFromGrouped(grouped),
    [grouped],
  );

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageHits = mappedHits.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [mappedHits.length]);

  return (
    <>
      <div className="min-h-[320px]">
        <p className="text-text-secondary mb-6">
          {mappedHits.length} Results Found
        </p>

        <div className="flex w-full items-center justify-center md:items-start md:justify-start">
          <div className="grid w-full max-w-[900px] lg:max-w-[1296px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 lg:gap-x-4 xl:gap-x-8! gap-y-6 md:gap-y-8 lg:gap-y-16">
            {pageHits.map((hit) => (
              <ClassHitComponent
                key={hit.objectID}
                hit={hit}
                fromClassFinderUrl={fromClassFinderUrl}
              />
            ))}
          </div>
        </div>
      </div>

      <ClassSearchPagination
        totalItems={mappedHits.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

function ClassSearchPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToPage = (newPage: number) => {
    onPageChange(newPage);
    document
      .querySelector(".pagination-scroll-to")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center md:justify-start">
      <div className="flex items-center justify-center gap-2">
        <PaginationControl
          disabled={isFirstPage}
          onClick={() => goToPage(currentPage - 1)}
        >
          <Icon
            name="chevronLeft"
            size={32}
            color={isFirstPage ? "#CECECE" : "#0092BC"}
          />
        </PaginationControl>
        <p>
          {currentPage} of {totalPages}
        </p>
        <PaginationControl
          disabled={isLastPage}
          onClick={() => goToPage(currentPage + 1)}
        >
          <Icon
            name="chevronRight"
            size={32}
            color={isLastPage ? "#CECECE" : "#0092BC"}
          />
        </PaginationControl>
      </div>
    </div>
  );
}

function PaginationControl({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <div>
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={onClick} className="cursor-pointer">
        {children}
      </button>
    </div>
  );
}
