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
import { liteClient as algoliasearch } from 'algoliasearch/lite';

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
 * Filter Sessions UI state for the hydrated page.
 * The URL still mirrors filters/share state, but same-page URL changes do not
 * re-run the loader; InstantSearch uses the client Algolia key after first paint.
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
  const coordinatesRef = useRef<FinderGeoCoordinates>(
    coordinatesFromUrl(initialSearchParamsRef.current),
  );
  const [locationSource, setLocationKind] = useState<'zip' | 'gps' | null>(
    null,
  );

  useEffect(() => {
    const next = coordinatesFromUrl(searchParams);
    coordinatesRef.current = next;
    setCoordinatesState(next);
  }, [searchParams]);

  const searchClient = useMemo(
    () =>
      algoliasearch(
        loaderData.ALGOLIA_APP_ID,
        loaderData.ALGOLIA_SEARCH_API_KEY,
        {},
      ),
    [loaderData.ALGOLIA_APP_ID, loaderData.ALGOLIA_SEARCH_API_KEY],
  );

  const setCoordinates = useCallback(
    (next: FinderGeoCoordinates) => {
      coordinatesRef.current = next;
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
    coordinatesRef.current = null;
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
      const coords = coordinatesRef.current;
      if (
        coords?.lat != null &&
        coords.lng != null &&
        !Number.isNaN(coords.lat) &&
        !Number.isNaN(coords.lng)
      ) {
        urlState.lat = coords.lat;
        urlState.lng = coords.lng;
      } else {
        delete urlState.lat;
        delete urlState.lng;
      }
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
