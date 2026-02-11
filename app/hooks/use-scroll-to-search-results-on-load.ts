import { useEffect, useRef } from "react";

const SCROLL_DELAY_MS = 100;
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

  useEffect(() => {
    if (hasScrolledRef.current) return;
    if (!hasActiveFilters(searchParams)) return;

    const id = window.setTimeout(() => {
      hasScrolledRef.current = true;
      const target = document.querySelector(SCROLL_TARGET_SELECTOR);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, SCROLL_DELAY_MS);

    return () => window.clearTimeout(id);
    // Only re-run when searchParams change; hasActiveFilters is read from closure
  }, [searchParams]);
}
