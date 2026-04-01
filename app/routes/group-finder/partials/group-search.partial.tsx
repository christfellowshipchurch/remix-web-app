import { useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  Stats,
} from "react-instantsearch";

import Icon from "~/primitives/icon";
import { useResponsive } from "~/hooks/use-responsive";

import { FindersCustomPagination } from "../components/finders-custom-pagination.component";
import { LoaderReturnType } from "../loader";
import { GroupHit } from "../components/group-hit.component";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GroupFinderOverflowFiltersPanel } from "../components/group-finder-overflow-filters.component";
import { cn } from "~/lib/utils";
import { GroupType } from "../types";
import {
  parseGroupFinderUrlState,
  groupFinderUrlStateToParams,
  groupFinderEmptyState,
  hasGroupFinderNonInstantSearchFilters,
  type GroupFinderUrlState,
} from "../group-finder-url-state";
import { useAlgoliaUrlSync } from "~/hooks/use-algolia-url-sync";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";
import { useStickyTopBelowNavbarClass } from "~/hooks/use-sticky-top-below-navbar";
import {
  SearchFilters,
  type SearchFilterDesktopItem,
} from "~/components/finders/search-filters";
import { ActiveFilters } from "~/components/finders/search-filters/active-filter.component";
import {
  getGroupSearchDesktopFilters,
  GROUP_FINDER_MORE_POPUP_TITLE,
} from "../group-search-filters.data";

const INDEX_NAME = "dev_daniel_Groups";

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 2 (initial state from URL). */
function getInitialStateFromUrl(searchParams: URLSearchParams) {
  const urlState = parseGroupFinderUrlState(searchParams);
  const ageInput = urlState.age ?? "";
  const selectedLocation = urlState.campus ?? null;
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
  return { coordinates: null, ageInput, selectedLocation, initialUiState };
}

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const stickyTopClass = useStickyTopBelowNavbarClass();

  const { cancelDebounce, debouncedUpdateUrl, updateUrlIfChanged } =
    useAlgoliaUrlSync({
      searchParams,
      setSearchParams,
      toParams: groupFinderUrlStateToParams,
      debounceMs: 400,
    });

  const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);

  const [coordinates, setCoordinatesState] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(initial.coordinates);
  const [locationSource, setLocationSource] = useState<
    "zip" | "gps" | null
  >(null);
  const [ageInput, setAgeInputState] = useState<string>(initial.ageInput);
  const [selectedLocation, setSelectedLocationState] = useState<string | null>(
    initial.selectedLocation,
  );

  /** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A steps 3, 5 (custom state ref). */
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

  /** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 4 (sync custom state from URL). */
  useEffect(() => {
    const urlState = parseGroupFinderUrlState(searchParams);
    setAgeInputState(urlState.age ?? "");
    setSelectedLocationState(urlState.campus ?? null);
  }, [searchParams]);

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {},
  );

  const clearAllFiltersFromUrl = () => {
    cancelDebounce();
    customStateRef.current = {
      coordinates: null,
      ageInput: "",
      selectedLocation: null,
    };
    setCoordinatesState(null);
    setLocationSource(null);
    setAgeInputState("");
    setSelectedLocationState(null);
    setSearchParams(groupFinderUrlStateToParams(groupFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
  };

  const setCoordinates = useCallback((next: typeof coordinates) => {
    setCoordinatesState(next);
    const noCoords =
      next == null ||
      next.lat == null ||
      next.lng == null ||
      Number.isNaN(next.lat) ||
      Number.isNaN(next.lng);
    if (noCoords) {
      setLocationSource(null);
    }
  }, []);

  const setAgeInput = (next: string) => {
    setAgeInputState(next);
    const ageValue = next.trim().length >= 2 ? next.trim() : undefined;
    const merged: GroupFinderUrlState = {
      ...parseGroupFinderUrlState(searchParams),
      age: ageValue,
    };
    updateUrlIfChanged(merged);
  };

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseGroupFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList ?? {}).length > 0) ||
      s.campus != null ||
      (s.age?.trim?.()?.length ?? 0) > 0
    );
  });

  const fromGroupFinderUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const additionalClearAllFiltersActive = hasGroupFinderNonInstantSearchFilters(
    parseGroupFinderUrlState(searchParams),
    coordinates,
  );

  const desktopFilters = useMemo(
    () =>
      getGroupSearchDesktopFilters({
        coordinates,
        setCoordinates,
        locationSource,
        onLocationKind: setLocationSource,
      }),
    [coordinates, setCoordinates, locationSource],
  );

  const isFilterPillSupplementallyActive = useCallback(
    (item: SearchFilterDesktopItem) => {
      if (item.id === "people") return ageInput.trim().length >= 2;
      if (item.id === "location")
        return (
          selectedLocation != null ||
          (coordinates?.lat != null &&
            coordinates?.lng != null &&
            !Number.isNaN(coordinates.lat) &&
            !Number.isNaN(coordinates.lng))
        );
      return false;
    },
    [ageInput, selectedLocation, coordinates],
  );

  /** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 3 (onStateChange → URL). */
  const syncUrlFromUiState = (indexUiState: Record<string, unknown>) => {
    const urlState: GroupFinderUrlState = {
      ...parseGroupFinderUrlState(searchParams),
      query: (indexUiState.query as string) ?? undefined,
      refinementList:
        (indexUiState.refinementList as Record<string, string[]>) ?? undefined,
      campus: customStateRef.current.selectedLocation ?? undefined,
      age: customStateRef.current.ageInput || undefined,
    };
    debouncedUpdateUrl(urlState);
  };

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
          selectedLocation={selectedLocation}
          ageInput={ageInput}
          coordinates={coordinates}
        />
        <div className="flex flex-col">
          <div
            className={cn(
              "sticky z-20 border-b border-black/5 bg-white shadow-sm content-padding select-none transition-all duration-300",
              stickyTopClass,
            )}
          >
            <div className="mx-auto flex max-w-screen-content flex-col gap-3 py-4 md:flex-row md:items-center md:gap-4">
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
                desktopFilters={desktopFilters}
                compactInlineFilterCount={2}
                filterPopupAgeInput={ageInput}
                setFilterPopupAgeInput={setAgeInput}
                isFilterPillSupplementallyActive={
                  isFilterPillSupplementallyActive
                }
                renderMorePanel={({
                  onHide,
                  onClearAllToUrl,
                  mobileBottomSheet,
                }) => (
                  <GroupFinderOverflowFiltersPanel
                    onHide={onHide}
                    ageInput={ageInput}
                    setAgeInput={setAgeInput}
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                    locationSource={locationSource}
                    onLocationKind={setLocationSource}
                    onClearAllToUrl={onClearAllToUrl}
                    mobileBottomSheet={mobileBottomSheet}
                    bottomSheetTitle={GROUP_FINDER_MORE_POPUP_TITLE}
                  />
                )}
              />
            </div>
            <ActiveFilters
              onClearAllToUrl={clearAllFiltersFromUrl}
              additionalFiltersActive={additionalClearAllFiltersActive}
            />
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
              <div className="min-h-[320px]">
                <Hits
                  classNames={{
                    root: "flex items-center justify-center md:items-start md:justify-start w-full",
                    item: "flex items-center justify-center md:items-start md:justify-start w-full",
                    list: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 lg:gap-x-4 xl:!gap-x-8 gap-y-6 md:gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1296px]",
                  }}
                  hitComponent={({ hit }: { hit: GroupType }) => {
                    return (
                      <GroupHit
                        hit={hit}
                        fromGroupFinderUrl={fromGroupFinderUrl}
                      />
                    );
                  }}
                />
              </div>
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
  /** When set, skips responsive 5–12 caps (e.g. class finder groups many hits by `classType` client-side). */
  hitsPerPageOverride,
}: {
  selectedLocation: string | null;
  ageInput: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  hitsPerPageOverride?: number;
}) => {
  const { isSmall, isMedium, isLarge, isXLarge } = useResponsive();

  const hitsPerPage =
    hitsPerPageOverride ??
    (() => {
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
