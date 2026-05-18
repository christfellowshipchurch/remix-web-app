import { useLoaderData, useSearchParams } from 'react-router-dom';
import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InstantSearch } from 'react-instantsearch';

import {
  buildIndexInitialUiState,
  hasActiveFinderGeoCoordinates,
  isLocationPillSupplementallyActiveFromGeo,
  type FinderGeoCoordinates,
} from '~/components/finders/finder-algolia.utils';
import type { SearchFilterDesktopItem } from '~/components/finders/search-filters';
import { useAlgoliaUrlSync } from '~/hooks/use-algolia-url-sync';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';
import { getClassSingleUpcomingDesktopFilters } from '../class-single-upcoming-filters.data';
import {
  classSingleEmptyState,
  classSingleUrlStateToParams,
  coordinatesFromClassSingleUrlState,
  parseClassSingleUrlState,
  type ClassSingleUrlState,
} from '../class-single-url-state';
import { CLASSES_ALGOLIA_INDEX_NAME } from '../components/build-class-single-algolia-search';
import { createClassSingleLoaderSearchClient } from '../components/create-class-single-loader-search-client';
import type { LoaderReturnType } from '../loader';

export const CLASS_SINGLE_UPCOMING_INDEX_NAME = CLASSES_ALGOLIA_INDEX_NAME;

function coordinatesFromUrl(
  searchParams: URLSearchParams,
): FinderGeoCoordinates {
  return coordinatesFromClassSingleUrlState(
    parseClassSingleUrlState(searchParams),
  );
}

/**
 * Filter Sessions UI state: URL is source of truth; loader refetches on navigation.
 * Geo (zip / current location) is stored as `lat`/`lng` in the URL so the loader can sort by distance.
 */
export function useClassSingleUpcomingInstantSearch() {
  const loaderData = useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { debouncedUpdateUrl, cancelDebounce, updateUrlIfChanged } =
    useAlgoliaUrlSync({
      searchParams,
      setSearchParams,
      toParams: classSingleUrlStateToParams,
      debounceMs: 400,
    });

  const initialSearchParamsRef = useRef(searchParams);
  const initialUiState = useMemo(
    () =>
      buildIndexInitialUiState(
        CLASS_SINGLE_UPCOMING_INDEX_NAME,
        parseClassSingleUrlState(initialSearchParamsRef.current),
      ),
    [],
  );

  const [coordinates, setCoordinatesState] = useState<FinderGeoCoordinates>(
    () => coordinatesFromUrl(initialSearchParamsRef.current),
  );
  const [locationSource, setLocationKind] = useState<'zip' | 'gps' | null>(
    null,
  );

  useEffect(() => {
    setCoordinatesState(coordinatesFromUrl(searchParams));
  }, [searchParams]);

  const searchClient = useMemo(
    () => createClassSingleLoaderSearchClient(loaderData),
    [loaderData],
  );

  const setCoordinates = useCallback(
    (next: FinderGeoCoordinates) => {
      setCoordinatesState(next);
      const noCoords =
        next == null ||
        next.lat == null ||
        next.lng == null ||
        Number.isNaN(next.lat) ||
        Number.isNaN(next.lng);
      if (noCoords) {
        setLocationKind(null);
      }

      const merged: ClassSingleUrlState = {
        ...parseClassSingleUrlState(searchParams),
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

  const clearAllFiltersFromUrl = useCallback(() => {
    cancelDebounce();
    setCoordinatesState(null);
    setLocationKind(null);
    setSearchParams(classSingleUrlStateToParams(classSingleEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
  }, [cancelDebounce, setSearchParams]);

  const syncUrlFromUiState = useCallback(
    (indexUiState: Record<string, unknown>) => {
      const urlState: ClassSingleUrlState = {
        ...parseClassSingleUrlState(searchParams),
        query: (indexUiState.query as string) ?? undefined,
        refinementList:
          (indexUiState.refinementList as Record<string, string[]>) ??
          undefined,
      };
      debouncedUpdateUrl(urlState);
    },
    [debouncedUpdateUrl, searchParams],
  );

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseClassSingleUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0) ||
      (s.lat != null && s.lng != null)
    );
  });

  const desktopFilters = useMemo(
    () =>
      getClassSingleUpcomingDesktopFilters({
        coordinates,
        setCoordinates,
        locationSource,
        onLocationKind: setLocationKind,
      }),
    [coordinates, setCoordinates, locationSource],
  );

  const isFilterPillSupplementallyActive = useCallback(
    (item: SearchFilterDesktopItem) =>
      isLocationPillSupplementallyActiveFromGeo(item, coordinates),
    [coordinates],
  );

  const geoFiltersActive = hasActiveFinderGeoCoordinates(coordinates);

  const onStateChange = useCallback<
    NonNullable<ComponentProps<typeof InstantSearch>['onStateChange']>
  >(
    ({ uiState, setUiState }) => {
      setUiState(uiState);
      const indexState = uiState[CLASS_SINGLE_UPCOMING_INDEX_NAME];
      if (indexState) syncUrlFromUiState(indexState as Record<string, unknown>);
    },
    [syncUrlFromUiState],
  );

  return {
    classUrl: loaderData.classUrl,
    searchClient,
    initialUiState,
    onStateChange,
    coordinates,
    clearAllFiltersFromUrl,
    desktopFilters,
    isFilterPillSupplementallyActive,
    geoFiltersActive,
  };
}
