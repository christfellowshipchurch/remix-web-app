import {
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from 'react-router-dom';
import { Configure, InstantSearch } from 'react-instantsearch';

import { FinderResultsStats } from '~/components/finders/finder-results-stats.component';
import { FinderStickyBar } from '~/components/finders/finder-sticky-bar.component';
import { useResponsive } from '~/hooks/use-responsive';
import { cn } from '~/lib/utils';
import { Icon } from '~/primitives/icon/icon';
import { GroupFinderFiltersSkeleton } from '../components/filters/group-finder-filters-skeleton.component';
import {
  buildGroupFinderInstantSearchUiState,
  GroupFinderInstantSearchSync,
} from '../components/group-finder-instant-search-sync.component';
import { GroupFinderQueryInput } from '../components/group-finder-query-input.component';
import { createGroupFinderLoaderSearchClient } from '../components/create-group-finder-loader-search-client';
import type { LoaderReturnType } from '../loader';
import { GroupHit } from '../components/group-hit.component';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { GroupFinderOverflowFiltersPanel } from '../components/group-finder-overflow-filters.component';
import { GROUPS_ALGOLIA_INDEX_NAME } from '../types';
import {
  parseGroupFinderUrlState,
  groupFinderUrlStateToParams,
  groupFinderEmptyState,
  hasGroupFinderNonInstantSearchFilters,
  type GroupFinderUrlState,
} from '../group-finder-url-state';
import { useAlgoliaUrlSync } from '~/hooks/use-algolia-url-sync';
import {
  SearchFilters,
  type SearchFilterDesktopItem,
} from '~/components/finders/search-filters';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';
import { ActiveFilters } from '~/components/finders/search-filters/active-filter.component';
import {
  getGroupSearchDesktopFilters,
  GROUP_FINDER_MORE_POPUP_TITLE,
} from '../group-search-filters.data';

function firstCampusRefinement(
  refinementList: Record<string, string[]> | undefined,
): string | null {
  const values = refinementList?.campusName;
  if (!values?.length) return null;
  const first = values[0]?.trim();
  return first ? first : null;
}

function coordinatesFromUrlState(
  urlState: ReturnType<typeof parseGroupFinderUrlState>,
) {
  if (
    urlState.lat != null &&
    urlState.lng != null &&
    Number.isFinite(urlState.lat) &&
    Number.isFinite(urlState.lng)
  ) {
    return { lat: urlState.lat, lng: urlState.lng };
  }
  return null;
}

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 2 (initial state from URL). */
function getInitialStateFromUrl(searchParams: URLSearchParams) {
  const urlState = parseGroupFinderUrlState(searchParams);
  const ageInput = urlState.age ?? '';
  const selectedLocation =
    firstCampusRefinement(urlState.refinementList) ?? null;

  return {
    coordinates: coordinatesFromUrlState(urlState),
    ageInput,
    selectedLocation,
    initialUiState: buildGroupFinderInstantSearchUiState(urlState),
  };
}

export const GroupSearch = () => {
  const loaderData = useLoaderData<LoaderReturnType>();
  const { groupHits, groupNbHits, groupNbPages, groupPage } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigation();

  const urlState = useMemo(
    () => parseGroupFinderUrlState(searchParams),
    [searchParams],
  );

  const isLoading =
    navigation.state === 'loading' &&
    navigation.location?.pathname === location.pathname;

  const searchClient = useMemo(
    () => createGroupFinderLoaderSearchClient(loaderData),
    [loaderData],
  );

  const { cancelDebounce, updateUrlIfChanged } = useAlgoliaUrlSync({
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
  const [locationSource, setLocationSource] = useState<'zip' | 'gps' | null>(
    null,
  );
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
    setAgeInputState(urlState.age ?? '');
    setSelectedLocationState(
      firstCampusRefinement(urlState.refinementList) ?? null,
    );
    setCoordinatesState(coordinatesFromUrlState(urlState));
  }, [searchParams]);

  const clearAllFiltersFromUrl = () => {
    cancelDebounce();
    customStateRef.current = {
      coordinates: null,
      ageInput: '',
      selectedLocation: null,
    };
    setCoordinatesState(null);
    setLocationSource(null);
    setAgeInputState('');
    setSelectedLocationState(null);
    setSearchParams(groupFinderUrlStateToParams(groupFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
  };

  const setCoordinates = useCallback(
    (next: typeof coordinates) => {
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

      const merged: GroupFinderUrlState = {
        ...parseGroupFinderUrlState(searchParams),
        age: customStateRef.current.ageInput || undefined,
        page: 0,
      };
      if (noCoords) {
        delete merged.lat;
        delete merged.lng;
      } else {
        merged.lat = next.lat ?? undefined;
        merged.lng = next.lng ?? undefined;
      }
      updateUrlIfChanged(merged);
    },
    [searchParams, updateUrlIfChanged],
  );

  const setAgeInput = (next: string) => {
    setAgeInputState(next);
    const ageValue = next.trim().length >= 2 ? next.trim() : undefined;
    const merged: GroupFinderUrlState = {
      ...parseGroupFinderUrlState(searchParams),
      age: ageValue,
      page: 0,
    };
    updateUrlIfChanged(merged);
  };

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseGroupFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList ?? {}).length > 0) ||
      (s.age?.trim?.()?.length ?? 0) > 0
    );
  });

  const fromGroupFinderUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : '');

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
      if (item.id === 'people') return ageInput.trim().length >= 2;
      if (item.id === 'location')
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

  const mergeUrlState = useCallback(
    (partial: Partial<GroupFinderUrlState>) => {
      const coords = customStateRef.current.coordinates;
      const merged: GroupFinderUrlState = {
        ...parseGroupFinderUrlState(searchParams),
        age: customStateRef.current.ageInput || undefined,
        lat: coords?.lat ?? undefined,
        lng: coords?.lng ?? undefined,
        ...partial,
      };
      return merged;
    },
    [searchParams],
  );

  const commitQuery = useCallback(
    (nextQuery: string) => {
      const q = nextQuery.trim();
      updateUrlIfChanged(
        mergeUrlState({
          query: q || undefined,
          page: 0,
        }),
      );
    },
    [mergeUrlState, updateUrlIfChanged],
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      updateUrlIfChanged(
        mergeUrlState({
          page: Math.max(0, nextPage),
        }),
      );
      const scrollTarget = document.querySelector('.pagination-scroll-to');
      scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [mergeUrlState, updateUrlIfChanged],
  );

  /** Refinements + pagination sync to URL immediately (loader refetch). Query uses {@link GroupFinderQueryInput}. */
  const syncUrlFromUiState = (indexUiState: Record<string, unknown>) => {
    const rawPage = indexUiState.page;
    const pageNum =
      typeof rawPage === 'number' && Number.isFinite(rawPage)
        ? Math.max(0, Math.floor(rawPage))
        : 0;
    updateUrlIfChanged(
      mergeUrlState({
        refinementList:
          (indexUiState.refinementList as Record<string, string[]>) ??
          undefined,
        page: pageNum > 0 ? pageNum : undefined,
      }),
    );
  };

  const isFirstPage = groupPage <= 0;
  const isLastPage = groupNbPages <= 0 || groupPage >= groupNbPages - 1;

  /** Defer InstantSearch so loader-driven results paint on SSR/first frame without waiting on react-instantsearch. */
  const [filtersMounted, setFiltersMounted] = useState(false);
  useEffect(() => {
    setFiltersMounted(true);
  }, []);

  return (
    <div
      className='flex w-full min-w-0 max-w-full flex-col gap-4 pagination-scroll-to'
      id='search'
    >
      <div className='flex flex-col'>
        <FinderStickyBar>
          {filtersMounted ? (
            <InstantSearch
              indexName={GROUPS_ALGOLIA_INDEX_NAME}
              searchClient={searchClient}
              initialUiState={
                Object.keys(initial.initialUiState).length > 0
                  ? initial.initialUiState
                  : undefined
              }
              onStateChange={({ uiState, setUiState }) => {
                setUiState(uiState);
                const indexState = uiState[GROUPS_ALGOLIA_INDEX_NAME];
                if (indexState)
                  syncUrlFromUiState(indexState as Record<string, unknown>);
              }}
              future={{
                preserveSharedStateOnUnmount: true,
              }}
            >
              <GroupFinderInstantSearchSync />
              <div className='mx-auto flex max-w-screen-content flex-col gap-3 py-4 md:flex-row md:items-center md:gap-4'>
                <GroupFinderQueryInput
                  query={urlState.query}
                  onQueryCommit={commitQuery}
                />
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
            </InstantSearch>
          ) : (
            <div className='mx-auto flex max-w-screen-content flex-col gap-3 py-4 md:flex-row md:items-center md:gap-4'>
              <GroupFinderQueryInput
                query={urlState.query}
                onQueryCommit={commitQuery}
              />
              <GroupFinderFiltersSkeleton />
            </div>
          )}
        </FinderStickyBar>

        <div className='flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding'>
          <div className='max-w-screen-content mx-auto md:w-full'>
            <FinderResultsStats hitCount={groupNbHits} />
            <div className='min-h-[320px]'>
              {groupHits.length === 0 && !isLoading ? (
                <p className='text-text-secondary text-center py-8'>
                  No groups found. Try adjusting your filters or search.
                </p>
              ) : (
                <div
                  className={cn(
                    'grid w-full max-w-[900px] items-stretch lg:max-w-[1296px] gap-y-6 sm:gap-x-6 md:gap-x-6 md:gap-y-8 lg:gap-x-4 lg:gap-y-12 xl:gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto md:mx-0',
                    isLoading && 'opacity-60 pointer-events-none',
                  )}
                >
                  {groupHits.map((hit) => (
                    <GroupHit
                      key={hit.objectID}
                      hit={hit}
                      backUrl={fromGroupFinderUrl}
                    />
                  ))}
                </div>
              )}
            </div>
            {groupNbPages > 1 && (
              <div className='mt-6 flex items-center justify-center gap-2 md:justify-start'>
                <GroupFinderPaginationButton
                  isDisabled={isFirstPage}
                  onClick={() => goToPage(groupPage - 1)}
                >
                  <Icon
                    name='chevronLeft'
                    size={32}
                    color={isFirstPage ? '#CECECE' : '#0092BC'}
                  />
                </GroupFinderPaginationButton>
                <p>
                  {groupPage + 1} of {groupNbPages}
                </p>
                <GroupFinderPaginationButton
                  isDisabled={isLastPage}
                  onClick={() => goToPage(groupPage + 1)}
                >
                  <Icon
                    name='chevronRight'
                    size={32}
                    color={isLastPage ? '#CECECE' : '#0092BC'}
                  />
                </GroupFinderPaginationButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function GroupFinderPaginationButton({
  children,
  isDisabled = false,
  onClick,
}: {
  children: ReactNode;
  isDisabled?: boolean;
  onClick: () => void;
}) {
  if (isDisabled) {
    return (
      <span className='inline-flex cursor-not-allowed items-center justify-center opacity-50'>
        {children}
      </span>
    );
  }

  return (
    <button
      type='button'
      onClick={onClick}
      className='inline-flex cursor-pointer items-center justify-center'
    >
      {children}
    </button>
  );
}

export const ResponsiveConfigure = ({
  ageInput,
  coordinates,
  /** When set, skips responsive 5–12 caps (e.g. class finder groups many hits by `classType` client-side). */
  hitsPerPageOverride,
}: {
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

  const filters = [];
  if (ageInput.trim().length >= 2) {
    const userAge = parseInt(ageInput, 10);
    if (!isNaN(userAge) && userAge >= 1) {
      // Filter groups where user's age falls within the group's age range
      filters.push(`minAge <= ${userAge} AND maxAge >= ${userAge}`);
    }
  }

  return (
    <Configure
      key={`${coordinates?.lat}-${coordinates?.lng}-${ageInput}`}
      hitsPerPage={hitsPerPage}
      filters={filters.length > 0 ? filters.join(' AND ') : undefined}
      aroundLatLng={
        coordinates?.lat && coordinates?.lng
          ? `${coordinates.lat}, ${coordinates.lng}`
          : undefined
      }
      aroundRadius='all'
      aroundLatLngViaIP={false}
      getRankingInfo={true}
    />
  );
};
