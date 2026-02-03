import { useRef, useEffect } from "react";
import type { SetURLSearchParams } from "react-router-dom";

/**
 * Options for useAlgoliaUrlSync.
 * Use with parse/toParams from createAlgoliaUrlStateConfig (see app/lib/algolia-url-state.ts).
 */
export type UseAlgoliaUrlSyncOptions<T> = {
  /** Current URL search params (from useSearchParams()). */
  searchParams: URLSearchParams;
  /** Router setter for search params (from useSearchParams()). */
  setSearchParams: SetURLSearchParams;
  /** Parse URL -> state (from createAlgoliaUrlStateConfig). */
  toParams: (state: T) => URLSearchParams;
  /** Debounce delay in ms before writing to the URL. Reduces history noise and avoids overwriting a "clear" with a pending update. */
  debounceMs?: number;
  /** If true, setSearchParams is called with { replace: true, preventScrollReset: true }. */
  replace?: boolean;
  preventScrollReset?: boolean;
};

/**
 * Return type of useAlgoliaUrlSync.
 * Use debouncedUpdateUrl when InstantSearch state or custom state changes; use cancelDebounce inside "Clear all".
 */
export type UseAlgoliaUrlSyncReturn<T> = {
  /**
   * Schedule a URL update with the given state. Updates are debounced so rapid changes
   * (e.g. typing, clicking filters) don't flood the history. Only the latest state wins.
   */
  debouncedUpdateUrl: (urlState: T) => void;
  /**
   * Call this inside your "Clear all" handler before setting the URL to empty. Cancels any
   * pending debounced update so the old state is not written back to the URL after clear.
   */
  cancelDebounce: () => void;
  /**
   * Update the URL immediately if the serialized state differs from current searchParams.
   * Used internally by debouncedUpdateUrl; exposed in case you need a one-off sync without debounce.
   */
  updateUrlIfChanged: (urlState: T) => void;
};

/**
 * Reusable hook for syncing Algolia finder state to the URL with debouncing.
 *
 * HOW TO REUSE:
 * ------------
 * 1. In your finder, get parse/toParams from createAlgoliaUrlStateConfig (your url-state module).
 * 2. Call: const { debouncedUpdateUrl, cancelDebounce, updateUrlIfChanged } = useAlgoliaUrlSync({
 *      searchParams, setSearchParams, toParams, debounceMs: 400,
 *    });
 * 3. In InstantSearch onStateChange: build full urlState (index uiState + your custom state ref),
 *    then debouncedUpdateUrl(urlState).
 * 4. When user changes a filter that lives outside InstantSearch (e.g. location, age): update your
 *    state and call debouncedUpdateUrl(mergedState).
 * 5. In "Clear all": call cancelDebounce() first, then set your state/ref to empty and
 *    setSearchParams(toParams(emptyState)).
 *
 * Why debounce? Filter changes and search input can fire many times per second. Writing to the
 * URL on every change would create many history entries and can race with a "Clear all" (a
 * pending write could overwrite the cleared URL after 400ms). Cancelling the debounce on clear
 * prevents that.
 */
export function useAlgoliaUrlSync<T>({
  searchParams,
  setSearchParams,
  toParams,
  debounceMs = 400,
  replace = true,
  preventScrollReset = true,
}: UseAlgoliaUrlSyncOptions<T>): UseAlgoliaUrlSyncReturn<T> {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const updateUrlIfChanged = useRef((urlState: T) => {
    const nextParams = toParams(urlState);
    const nextString = nextParams.toString();
    const currentString = searchParamsRef.current.toString();
    if (nextString !== currentString) {
      setSearchParams(nextParams, { replace, preventScrollReset });
    }
  }).current;

  const debouncedUpdateUrl = useRef((urlState: T) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      updateUrlIfChanged(urlState);
    }, debounceMs);
  }).current;

  const cancelDebounce = useRef(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }).current;

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return {
    debouncedUpdateUrl,
    cancelDebounce,
    updateUrlIfChanged,
  };
}
