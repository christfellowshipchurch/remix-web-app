/** Helpers for "is there anything Clear All would remove?" across Algolia finders. */

export function hasRefinementListValues(
  refinementList: Record<string, unknown> | undefined,
): boolean {
  if (!refinementList || Object.keys(refinementList).length === 0) return false;
  return Object.values(refinementList).some(
    (vals) =>
      Array.isArray(vals) &&
      vals.some((v) => v != null && String(v).trim() !== ''),
  );
}

export function hasInstantSearchIndexUiActiveFilters(indexUiState: {
  query?: string;
  refinementList?: Record<string, unknown>;
}): boolean {
  if ((indexUiState.query?.trim()?.length ?? 0) > 0) return true;
  return hasRefinementListValues(indexUiState.refinementList);
}
