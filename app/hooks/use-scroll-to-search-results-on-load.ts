import { useEffect, useRef } from "react";

const SCROLL_DELAY_MS = 400;
const SCROLL_TARGET_SELECTOR = ".pagination-scroll-to";

/**
 * On initial load, if the URL has any active filters (query or refinements),
 * scroll the search results section into view. Used by finders that sync state to the URL.
 */
export function useScrollToSearchResultsOnLoad(
  searchParams: URLSearchParams,
  hasActiveFilters: (params: URLSearchParams) => boolean
) {
  const hasScrolledRef = useRef(false);

  // Depend on stringified params so the effect doesn't re-run on every render
  // (searchParams reference can change), which would clear the timeout before it fires.
  const searchString = searchParams.toString();

  useEffect(() => {
    if (hasScrolledRef.current) return;
    if (!hasActiveFilters(searchParams)) return;

    const id = window.setTimeout(() => {
      hasScrolledRef.current = true;
      const target = document.querySelector(SCROLL_TARGET_SELECTOR);
      if (target) {
        window.requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }, SCROLL_DELAY_MS);

    return () => window.clearTimeout(id);
    // searchString is stable so we only re-run when the URL search actually changes
  }, [searchString]);
}
