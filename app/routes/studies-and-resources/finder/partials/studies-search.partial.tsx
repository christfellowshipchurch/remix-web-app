import { useMemo, useState, useEffect } from "react";
import { useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, useHits } from "react-instantsearch";

import Icon from "~/primitives/icon";

import { LoaderReturnType } from "../loader";
import { AllStudiesFiltersPopup } from "../components/popups/all-filters.component";
import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";
import { ResponsiveConfigure } from "~/routes/group-finder/partials/group-search.partial";
import { StudyHitType } from "../../types";
import {
  parseStudiesFinderUrlState,
  studiesFinderUrlStateToParams,
  studiesFinderEmptyState,
  type StudiesFinderUrlState,
} from "../../studies-finder-url-state";
import { useAlgoliaUrlSync } from "~/hooks/use-algolia-url-sync";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";
import { AlgoliaFinderClearAllButton } from "~/routes/group-finder/components/clear-all-button.component";
import { DesktopStudyFilters } from "../components/popups/studies-filters";
import { StudyHitComponent } from "../components/studies-hit-component.component";

const INDEX_NAME = "dev_StudiesAndResourcesItems";

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 2. */
function getInitialStateFromUrl(searchParams: URLSearchParams) {
  const urlState = parseStudiesFinderUrlState(searchParams);
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

export const StudiesSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const { debouncedUpdateUrl, cancelDebounce } = useAlgoliaUrlSync({
    searchParams,
    setSearchParams,
    toParams: studiesFinderUrlStateToParams,
    debounceMs: 400,
  });

  const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [instantSearchKey, setInstantSearchKey] = useState(0);

  // Scroll handling effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;
      const scrollDelta = currentScrollY - lastScrollY;

      // Reset at top of page
      if (currentScrollY < scrollThreshold) {
        setLastScrollY(currentScrollY);
        return;
      }

      // Handle scroll direction
      if (Math.abs(scrollDelta) > scrollThreshold) {
        // When scrolling up (negative delta), navbar is showing
        if (scrollDelta < 0) {
          setIsNavbarOpen(true);
        } else {
          // When scrolling down, navbar is hidden
          setIsNavbarOpen(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {},
  );

  const clearAllFiltersFromUrl = () => {
    cancelDebounce();
    setSearchParams(studiesFinderUrlStateToParams(studiesFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
    setInstantSearchKey((k) => k + 1);
  };

  const syncUrlFromUiState = (indexUiState: Record<string, unknown>) => {
    const urlState: StudiesFinderUrlState = {
      ...parseStudiesFinderUrlState(searchParams),
      query: (indexUiState.query as string) ?? undefined,
      refinementList:
        (indexUiState.refinementList as Record<string, string[]>) ?? undefined,
    };
    debouncedUpdateUrl(urlState);
  };

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseStudiesFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const fromStudiesFinderUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return (
    <div
      className="flex flex-col gap-4 w-screen pt-12 pagination-scroll-to"
      id="search"
    >
      <InstantSearch
        key={instantSearchKey}
        indexName={INDEX_NAME}
        searchClient={searchClient}
        initialUiState={
          instantSearchKey > 0
            ? { [INDEX_NAME]: {} }
            : Object.keys(initial.initialUiState).length > 0
              ? initial.initialUiState
              : undefined
        }
        onStateChange={({ uiState }) => {
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
        />
        <div className="flex flex-col">
          <div
            className={cn(
              "sticky bg-white z-2 content-padding md:shadow-sm select-none transition-all duration-300",
              isNavbarOpen ? "top-18 md:top-20" : "top-0",
            )}
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 lg:gap-4 xl:gap-8 py-4 max-w-screen-content mx-auto h-20">
              <div className="w-full md:w-[240px] lg:w-[250px] xl:w-[266px] flex items-center rounded-lg bg-[#EDF3F8] focus-within:border-ocean py-2">
                <Icon name="searchAlt" className="text-neutral-default ml-3" />
                <SearchBox
                  placeholder="Keyword"
                  translations={{
                    submitButtonTitle: "Search",
                    resetButtonTitle: "Reset",
                  }}
                  classNames={{
                    root: "flex-grow",
                    form: "flex",
                    input: "w-full text-xl px-2 focus:outline-none",
                    resetIcon: "hidden",
                    submit: "hidden",
                    loadingIcon: "hidden",
                  }}
                />
              </div>

              <div className="hidden md:flex items-center gap-4">
                <DesktopStudyFilters onClearAllToUrl={clearAllFiltersFromUrl} />
                <AlgoliaFinderClearAllButton
                  className="hidden lg:block"
                  onClearAllToUrl={clearAllFiltersFromUrl}
                />
              </div>
            </div>
          </div>

          <div className="md:hidden bg-white pb-5 border-b-2 border-black/10 border-solid select-none">
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
                  ? "z-4 opacity-100 top-[calc(102%)]"
                  : "-z-1 opacity-0 pointer-events-none",
              )}
            >
              <AllStudiesFiltersPopup
                onHide={() => setIsMobileOpen(false)}
                onClearAllToUrl={clearAllFiltersFromUrl}
              />
            </div>
          </div>

          {/* Studies Search Results / Studies Type Filters */}
          <div className="flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding">
            <div className="max-w-screen-content mx-auto md:w-full">
              <CustomStudyTypeFacets
                fromStudiesFinderUrl={fromStudiesFinderUrl}
              />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

interface GroupedStudyType {
  coverImage: string;
  title: string;
  url: string;
  summary: string;
  topic: StudyHitType["topic"];
  format: StudyHitType["format"] | "Multiple Formats";
  duration: StudyHitType["duration"];
  audience: StudyHitType["audience"] | "Multiple";
  source: StudyHitType["source"] | "Multiple";
}

const CustomStudyTypeFacets = ({
  fromStudiesFinderUrl,
}: {
  fromStudiesFinderUrl?: string;
}) => {
  const { items } = useHits<StudyHitType>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const groupedStudyTypes: GroupedStudyType[] = useMemo(() => {
    const grouped = items.reduce((acc, hit) => {
      const studyType = hit.studyType;
      const existingGroup = acc.find((group) => group.title === studyType);

      if (existingGroup) {
        existingGroup.format = "Multiple Formats";
        existingGroup.audience = "Multiple";
        existingGroup.source = "Multiple";
      } else {
        acc.push({
          coverImage: hit.coverImage?.sources?.[0]?.uri ?? "",
          title: hit.title,
          url: hit.url,
          summary: hit.description ?? hit.summary ?? "",
          topic: hit.topic ?? "Spiritual Growth",
          format: hit.format ?? "Video",
          duration: hit.duration ?? "Short",
          audience: hit.audience ?? "Everyone",
          source: hit.source ?? "Christ Fellowship",
        });
      }

      return acc;
    }, [] as GroupedStudyType[]);

    return grouped;
  }, [items]);

  const mappedStudyTypes: StudyHitType[] = useMemo(() => {
    return groupedStudyTypes.map((group, index) => {
      return {
        objectID: `grouped-${index}`,
        id: `grouped-${index}`,
        title: group.title,
        studyType: group.title as StudyHitType["studyType"],
        url: group.url as StudyHitType["url"],
        summary: group.summary,
        description: group.summary,
        coverImage: {
          sources: [{ uri: group.coverImage }],
        },
        duration: group.duration,
        topic: group.topic,
        format: group.format === "Multiple Formats" ? "Video" : group.format,
        audience: group.audience === "Multiple" ? "Everyone" : group.audience,
        source:
          group.source === "Multiple" ? "Christ Fellowship" : group.source,
        _highlightResult: {
          title: { value: group.title, matchLevel: "none", matchedWords: [] },
          summary: {
            value: group.summary,
            matchLevel: "none",
            matchedWords: [],
          },
          author: {
            firstName: { value: "", matchLevel: "none", matchedWords: [] },
            lastName: { value: "", matchLevel: "none", matchedWords: [] },
          },
          routing: {
            pathname: { value: "", matchLevel: "none", matchedWords: [] },
          },
          htmlContent: [],
        },
        __position: index,
      };
    });
  }, [groupedStudyTypes]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = mappedStudyTypes.slice(startIndex, endIndex);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [mappedStudyTypes.length]);

  return (
    <>
      <div className="min-h-[320px]">
        <p className="text-text-secondary mb-6">
          {mappedStudyTypes.length} Results Found
        </p>

        <div className="flex items-center justify-center md:items-start md:justify-start w-full">
          <div className="flex items-center justify-center md:items-start md:justify-start w-full">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 lg:gap-x-4 xl:gap-x-8! gap-y-6 md:gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1296px]">
              {paginatedItems.map((hit) => (
                <StudyHitComponent
                  key={hit.objectID}
                  hit={hit}
                  fromStudiesFinderUrl={fromStudiesFinderUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <StudySearchCustomPagination
        mappedStudyTypes={mappedStudyTypes}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

const StudySearchCustomPagination = ({
  mappedStudyTypes,
  itemsPerPage = 12,
  currentPage,
  onPageChange,
}: {
  mappedStudyTypes: StudyHitType[];
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(mappedStudyTypes.length / itemsPerPage);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    // Scroll to the pagination-scroll-to element
    const scrollTarget = document.querySelector(".pagination-scroll-to");
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center md:justify-start">
      <div className="flex items-center justify-center gap-2">
        <StudyPaginationItem
          isDisabled={isFirstPage}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <Icon
            name="chevronLeft"
            size={32}
            color={isFirstPage ? "#CECECE" : "#0092BC"}
          />
        </StudyPaginationItem>
        <p>
          {currentPage} of {totalPages}
        </p>
        <StudyPaginationItem
          isDisabled={isLastPage}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <Icon
            name="chevronRight"
            size={32}
            color={isLastPage ? "#CECECE" : "#0092BC"}
          />
        </StudyPaginationItem>
      </div>
    </div>
  );
};

type StudyPaginationItemProps = {
  onClick: () => void;
  isDisabled: boolean;
  children: React.ReactNode;
};

function StudyPaginationItem({
  isDisabled,
  onClick,
  children,
}: StudyPaginationItemProps) {
  if (isDisabled) {
    return (
      <div>
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onClick} className="cursor-pointer">
        {children}
      </button>
    </div>
  );
}
