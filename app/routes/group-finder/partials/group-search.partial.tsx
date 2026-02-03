import { useLoaderData, useSearchParams } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  Stats,
} from "react-instantsearch";

import { DesktopGroupFilters } from "../components/filters/group-filters";

import Icon from "~/primitives/icon";
import { useResponsive } from "~/hooks/use-responsive";

import { FindersCustomPagination } from "../components/finders-custom-pagination.component";
import { LoaderReturnType } from "../loader";
import { GroupHit } from "../components/group-hit.component";
import { useEffect, useState, useRef, useMemo } from "react";
import { AllGroupFiltersPopup } from "../components/filters/all-filters.component";
import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";
import { GroupType } from "../types";
import {
  parseGroupFinderUrlState,
  groupFinderUrlStateToParams,
  type GroupFinderUrlState,
} from "../group-finder-url-state";

const INDEX_NAME = "dev_daniel_Groups";

function getInitialStateFromUrl(searchParams: URLSearchParams) {
  const urlState = parseGroupFinderUrlState(searchParams);
  const coordinates =
    urlState.lat != null && urlState.lng != null
      ? { lat: urlState.lat, lng: urlState.lng }
      : null;
  const ageInput = urlState.age ?? "";
  const selectedLocation = urlState.campus ?? null;
  const initialUiState: { [key: string]: Record<string, unknown> } = {};
  if (
    urlState.query !== undefined ||
    urlState.page !== undefined ||
    (urlState.refinementList && Object.keys(urlState.refinementList).length > 0)
  ) {
    initialUiState[INDEX_NAME] = {};
    if (urlState.query !== undefined)
      initialUiState[INDEX_NAME].query = urlState.query;
    if (urlState.page != null && urlState.page > 1) {
      initialUiState[INDEX_NAME].page = urlState.page - 1;
    }
    if (
      urlState.refinementList &&
      Object.keys(urlState.refinementList).length > 0
    ) {
      initialUiState[INDEX_NAME].refinementList = urlState.refinementList;
    }
  }
  return { coordinates, ageInput, selectedLocation, initialUiState };
}

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const initial = useMemo(
    () => getInitialStateFromUrl(searchParams),
    [] // only on mount
  );

  const [coordinates, setCoordinatesState] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(initial.coordinates);
  const [ageInput, setAgeInputState] = useState<string>(initial.ageInput);
  const [selectedLocation, setSelectedLocationState] = useState<string | null>(
    initial.selectedLocation
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  type CustomState = {
    coordinates: { lat: number | null; lng: number | null } | null;
    ageInput: string;
    selectedLocation: string | null;
  };
  const customStateRef = useRef<CustomState>({
    coordinates: initial.coordinates,
    ageInput: initial.ageInput,
    selectedLocation: initial.selectedLocation,
  });
  customStateRef.current = {
    coordinates,
    ageInput,
    selectedLocation,
  };

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const DEBOUNCE_MS = 400;

  const updateUrlIfChanged = useRef((urlState: GroupFinderUrlState) => {
    const nextParams = groupFinderUrlStateToParams(urlState);
    const nextString = nextParams.toString();
    const currentString = searchParamsRef.current.toString();
    if (nextString !== currentString) {
      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    }
  }).current;

  const debouncedUpdateUrl = useRef((urlState: GroupFinderUrlState) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      updateUrlIfChanged(urlState);
    }, DEBOUNCE_MS);
  }).current;

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // Sync custom state from URL when user navigates back/forward
  useEffect(() => {
    const urlState = parseGroupFinderUrlState(searchParams);
    if (urlState.lat != null && urlState.lng != null) {
      setCoordinatesState({ lat: urlState.lat, lng: urlState.lng });
    } else {
      setCoordinatesState(null);
    }
    setAgeInputState(urlState.age ?? "");
    setSelectedLocationState(urlState.campus ?? null);
  }, [searchParams]);

  // Scroll handling effect for fixed search bar
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

  const mergeUrlState = (partial: Partial<GroupFinderUrlState>) => {
    const current = parseGroupFinderUrlState(searchParams);
    const merged: GroupFinderUrlState = { ...current, ...partial };
    debouncedUpdateUrl(merged);
  };

  const setCoordinates = (next: typeof coordinates) => {
    setCoordinatesState(next);
    mergeUrlState({
      lat: next?.lat ?? undefined,
      lng: next?.lng ?? undefined,
    });
  };

  const setAgeInput = (next: string) => {
    setAgeInputState(next);
    mergeUrlState({
      age: next.trim().length >= 2 ? next.trim() : undefined,
    });
  };

  const syncUrlFromUiState = (indexUiState: Record<string, unknown>) => {
    const urlState: GroupFinderUrlState = {
      ...parseGroupFinderUrlState(searchParams),
      query: (indexUiState.query as string) ?? undefined,
      page:
        typeof indexUiState.page === "number" && indexUiState.page > 0
          ? indexUiState.page + 1
          : undefined,
      refinementList:
        (indexUiState.refinementList as Record<string, string[]>) ?? undefined,
      campus: customStateRef.current.selectedLocation ?? undefined,
      age: customStateRef.current.ageInput || undefined,
      lat: customStateRef.current.coordinates?.lat ?? undefined,
      lng: customStateRef.current.coordinates?.lng ?? undefined,
    };
    debouncedUpdateUrl(urlState);
  };

  return (
    <div
      className="flex flex-col gap-4 w-full pt-12 pagination-scroll-to"
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
          selectedLocation={selectedLocation}
          ageInput={ageInput}
          coordinates={coordinates}
        />
        <div className="flex flex-col">
          {/* Desktop Filters Section */}
          <div
            className={cn(
              "sticky bg-white z-2 content-padding shadow-sm select-none transition-all duration-300",
              isNavbarOpen ? "top-18 md:top-20" : "top-0"
            )}
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 lg:gap-4 xl:gap-8 py-4 max-w-screen-content mx-auto h-20">
              {/* Group Search Box */}
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

              {/* Desktop Filters */}
              <div className="hidden md:block">
                <DesktopGroupFilters
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                  ageInput={ageInput}
                  setAgeInput={setAgeInput}
                />
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden bg-white border-b-2 border-black/10 border-solid select-none">
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
                "absolute transition-all duration-300 w-full",
                isMobileOpen
                  ? "z-4 opacity-100 top-[calc(92%_+_24px)]"
                  : "-z-1 opacity-0"
              )}
            >
              <AllGroupFiltersPopup
                onHide={() => setIsMobileOpen(false)}
                ageInput={ageInput}
                setAgeInput={setAgeInput}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
              />
            </div>
          </div>

          {/* Group Search Hits / Results & Pagination */}
          <div className="flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding">
            <div className="max-w-screen-content mx-auto md:w-full">
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
                  root: "flex items-center justify-center md:items-start md:justify-start w-full",
                  item: "flex items-center justify-center md:items-start md:justify-start w-full",
                  list: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 lg:gap-x-4 xl:!gap-x-8 gap-y-6 md:gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1296px]",
                }}
                hitComponent={({ hit }: { hit: GroupType }) => {
                  return <GroupHit hit={hit} />;
                }}
              />
              <div className="mt-6 flex justify-center md:justify-start">
                <FindersCustomPagination />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

export const ResponsiveConfigure = ({
  selectedLocation,
  ageInput,
  coordinates,
}: {
  selectedLocation: string | null;
  ageInput: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
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
  if (ageInput.trim().length >= 2) {
    const userAge = parseInt(ageInput, 10);
    if (!isNaN(userAge) && userAge >= 1) {
      // Filter groups where user's age falls within the group's age range
      filters.push(`minAge <= ${userAge} AND maxAge >= ${userAge}`);
    }
  }

  return (
    <Configure
      key={`${coordinates?.lat}-${coordinates?.lng}-${selectedLocation}-${ageInput}`}
      hitsPerPage={hitsPerPage}
      filters={filters.length > 0 ? filters.join(" AND ") : undefined}
      aroundLatLng={
        coordinates?.lat && coordinates?.lng
          ? `${coordinates.lat}, ${coordinates.lng}`
          : undefined
      }
      aroundRadius="all"
      aroundLatLngViaIP={false}
      getRankingInfo={true}
    />
  );
};
