import { useLoaderData, useSearchParams } from "react-router-dom";
import {
  type ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";

import {
  buildIndexInitialUiState,
  hasActiveFinderGeoCoordinates,
  isLocationPillSupplementallyActiveFromGeo,
  type FinderGeoCoordinates,
} from "~/components/finders/finder-algolia.utils";
import type { SearchFilterDesktopItem } from "~/components/finders/search-filters";
import { useAlgoliaUrlSync } from "~/hooks/use-algolia-url-sync";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";
import { getClassSingleUpcomingDesktopFilters } from "../class-single-upcoming-filters.data";
import {
  classSingleEmptyState,
  classSingleUrlStateToParams,
  parseClassSingleUrlState,
  type ClassSingleUrlState,
} from "../class-single-url-state";
import type { LoaderReturnType } from "../loader";

export const CLASS_SINGLE_UPCOMING_INDEX_NAME = "dev_Classes";

export function useClassSingleUpcomingInstantSearch() {
  const { classUrl, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { debouncedUpdateUrl, cancelDebounce } = useAlgoliaUrlSync({
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
    null,
  );
  const [locationSource, setLocationKind] = useState<"zip" | "gps" | null>(
    null,
  );

  const setCoordinates = useCallback((next: FinderGeoCoordinates) => {
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
  }, []);

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
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const searchClient = useMemo(
    () => algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {}),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

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
    NonNullable<ComponentProps<typeof InstantSearch>["onStateChange"]>
  >(
    ({ uiState, setUiState }) => {
      setUiState(uiState);
      const indexState = uiState[CLASS_SINGLE_UPCOMING_INDEX_NAME];
      if (indexState)
        syncUrlFromUiState(indexState as Record<string, unknown>);
    },
    [syncUrlFromUiState],
  );

  return {
    classUrl,
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
