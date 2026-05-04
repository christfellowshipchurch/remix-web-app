/**
 * Shared Algolia / InstantSearch helpers for finder routes (URL state, filters, geo pills).
 */

/** Escape `\` and `"` for Algolia `filters` strings like `campus:"…"`. */
export function escapeAlgoliaFilterString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Builds InstantSearch `initialUiState` for one index from URL-shaped query + refinements.
 * See .github/ALGOLIA-URL-STATE-REUSABILITY.md — Pattern A.
 */
export function buildIndexInitialUiState(
  indexName: string,
  slice: {
    query?: string;
    refinementList?: Record<string, string[]>;
  },
): Record<string, Record<string, unknown>> | undefined {
  const hasQuery = slice.query !== undefined;
  const hasRef =
    slice.refinementList != null &&
    Object.keys(slice.refinementList).length > 0;
  if (!hasQuery && !hasRef) return undefined;
  const index: Record<string, unknown> = {};
  if (hasQuery) index.query = slice.query;
  if (hasRef) index.refinementList = slice.refinementList;
  return { [indexName]: index };
}

export type FinderGeoCoordinates = {
  lat: number | null;
  lng: number | null;
} | null;

export function hasActiveFinderGeoCoordinates(
  coordinates: FinderGeoCoordinates,
): boolean {
  if (coordinates == null) return false;
  const { lat, lng } = coordinates;
  return (
    lat != null &&
    lng != null &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  );
}

/** Highlights the location pill when geo is set (refinements alone may not cover zip/map). */
export function isLocationPillSupplementallyActiveFromGeo(
  item: { id: string },
  coordinates: FinderGeoCoordinates,
  locationPillId = "location",
): boolean {
  if (item.id !== locationPillId) return false;
  return hasActiveFinderGeoCoordinates(coordinates);
}
