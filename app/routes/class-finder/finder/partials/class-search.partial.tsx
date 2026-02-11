import { useMemo, useState, useEffect, useRef } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, useHits } from "react-instantsearch";

import Icon from "~/primitives/icon";

import { LoaderReturnType } from "../loader";
import { ClassHitComponent } from "../components/class-hit-component.component";
import { AllClassFiltersPopup } from "../components/popups/all-filters.component";
import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";
import { ResponsiveConfigure } from "~/routes/group-finder/partials/group-search.partial";
import { DesktopClassFilters } from "../components/popups/class-filters";
import { ClassHitType } from "../../types";
import {
  parseClassFinderUrlState,
  classFinderUrlStateToParams,
  classFinderEmptyState,
  type ClassFinderUrlState,
} from "../../class-finder-url-state";
import { useAlgoliaUrlSync } from "~/hooks/use-algolia-url-sync";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";
import { AlgoliaFinderClearAllButton } from "~/routes/group-finder/components/clear-all-button.component";

const INDEX_NAME = "dev_Classes";

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 2. */
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

  const { debouncedUpdateUrl, cancelDebounce } = useAlgoliaUrlSync({
    searchParams,
    setSearchParams,
    toParams: classFinderUrlStateToParams,
    debounceMs: 400,
  });

  const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);

  const [coordinates, setCoordinatesState] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(initial.coordinates);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [instantSearchKey, setInstantSearchKey] = useState(0);

  type CoordinatesState = {
    lat: number | null;
    lng: number | null;
  } | null;
  const customStateRef = useRef<{ coordinates: CoordinatesState }>({
    coordinates: initial.coordinates,
  });
  customStateRef.current = { coordinates };

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
    {}
  );

  const clearAllFiltersFromUrl = () => {
    cancelDebounce();
    customStateRef.current = { coordinates: null };
    setCoordinatesState(null);
    setSearchParams(classFinderUrlStateToParams(classFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
    setInstantSearchKey((k) => k + 1);
  };

  const setCoordinates = (next: typeof coordinates) => {
    setCoordinatesState(next);
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
          coordinates={coordinates}
        />
        <div className="flex flex-col">
          <div
            className={cn(
              "sticky bg-white z-2 content-padding md:shadow-sm select-none transition-all duration-300",
              isNavbarOpen ? "top-18 md:top-20" : "top-0"
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
                <DesktopClassFilters
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                  onClearAllToUrl={clearAllFiltersFromUrl}
                />
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
                  : "-z-1 opacity-0 pointer-events-none"
              )}
            >
              <AllClassFiltersPopup
                onHide={() => setIsMobileOpen(false)}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                onClearAllToUrl={clearAllFiltersFromUrl}
              />
            </div>
          </div>

          {/* Class Search Results / Class Type Filters */}
          <div className="flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding">
            <div className="max-w-screen-content mx-auto md:w-full">
              <CustomClassTypeFacets />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

interface GroupedClassType {
  coverImage: string;
  title: string;
  summary: string;
  subtitle: string;
  topic: string;
  classTypeUrl: string;
  locations: string | "Multiple Locations";
  format: "In-Person" | "Online" | "Multiple Formats";
  language: "English" | "Español" | "Multiple Languages";
}

const CustomClassTypeFacets = () => {
  const { items } = useHits<ClassHitType>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const groupedClassTypes: GroupedClassType[] = useMemo(() => {
    const grouped = items.reduce((acc, hit) => {
      const classType = hit.classType;
      const existingGroup = acc.find((group) => group.title === classType);

      if (existingGroup) {
        // If classType already exists, update locations / language to "Multiple Locations" / "Multiple Languages"
        existingGroup.locations = "Multiple Locations";
        existingGroup.language = "Multiple Languages";
      } else {
        // Create new group for this classType
        acc.push({
          coverImage: hit.coverImage.sources[0]?.uri || "",
          title: classType,
          classTypeUrl: hit.classTypeUrl,
          summary: hit.summary,
          subtitle: hit.subtitle,
          topic: hit.topic,
          locations: hit.campus.name,
          format: hit.format,
          language: hit.language,
        });
      }

      return acc;
    }, [] as GroupedClassType[]);

    return grouped;
  }, [items]);

  const mappedClassTypes: ClassHitType[] = useMemo(() => {
    return groupedClassTypes.map((group, index) => {
      return {
        objectID: `grouped-${index}`,
        id: `grouped-${index}`,
        title: group.title,
        classType: group.title as ClassHitType["classType"],
        classTypeUrl: group.classTypeUrl as ClassHitType["classTypeUrl"],
        subtitle: group.title,
        summary: group.subtitle,
        coverImage: {
          sources: [{ uri: group.coverImage }],
        },
        campus: {
          name: group.locations,
        },
        _geoloc: {
          lat: 0,
          lng: 0,
        },
        startDate: "",
        endDate: "",
        schedule: "",
        topic: group.topic as ClassHitType["topic"],
        language: group.language as ClassHitType["language"],
        format: group.format as ClassHitType["format"],
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
  }, [groupedClassTypes]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = mappedClassTypes.slice(startIndex, endIndex);

  // Reset to page 1 when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [mappedClassTypes.length]);

  return (
    <>
      <div className="min-h-[320px]">
        <p className="text-text-secondary mb-6">
          {mappedClassTypes.length} Results Found
        </p>

        <div className="flex items-center justify-center md:items-start md:justify-start w-full">
          <div className="flex items-center justify-center md:items-start md:justify-start w-full">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 lg:gap-x-4 xl:!gap-x-8 gap-y-6 md:gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1296px]">
              {paginatedItems.map((hit) => (
                <ClassHitComponent key={hit.objectID} hit={hit} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ClassSearchCustomPagination
        mappedClassTypes={mappedClassTypes}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

const ClassSearchCustomPagination = ({
  mappedClassTypes,
  itemsPerPage = 12,
  currentPage,
  onPageChange,
}: {
  mappedClassTypes: ClassHitType[];
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(mappedClassTypes.length / itemsPerPage);

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
        <ClassPaginationItem
          isDisabled={isFirstPage}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <Icon
            name="chevronLeft"
            size={32}
            color={isFirstPage ? "#CECECE" : "#0092BC"}
          />
        </ClassPaginationItem>
        <p>
          {currentPage} of {totalPages}
        </p>
        <ClassPaginationItem
          isDisabled={isLastPage}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <Icon
            name="chevronRight"
            size={32}
            color={isLastPage ? "#CECECE" : "#0092BC"}
          />
        </ClassPaginationItem>
      </div>
    </div>
  );
};

type ClassPaginationItemProps = {
  onClick: () => void;
  isDisabled: boolean;
  children: React.ReactNode;
};

function ClassPaginationItem({
  isDisabled,
  onClick,
  children,
}: ClassPaginationItemProps) {
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
