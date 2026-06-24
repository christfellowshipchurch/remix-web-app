import { useEffect } from 'react';
import type { UseInstantSearch } from 'react-instantsearch';

export const PAGE_CONTENT_TYPES = [
  'Ministry Page',
  'Page Builder',
  'Redirect Card',
] as const;

export type PageContentType = (typeof PAGE_CONTENT_TYPES)[number];

type RefinementItem = {
  value: string;
  count: number;
};

export function isPageContentType(value: string): value is PageContentType {
  return PAGE_CONTENT_TYPES.includes(value as PageContentType);
}

export function getPageRefinementItems(items: RefinementItem[]) {
  return items.filter((item) => isPageContentType(item.value));
}

export function hasVisiblePageRefinements(
  items: RefinementItem[],
  hasMatchingLocationResults = false,
) {
  return (
    hasMatchingLocationResults ||
    getPageRefinementItems(items).some((item) => item.count > 0)
  );
}

export function withoutPageContentTypes(selected: string[]) {
  return selected.filter((value) => !isPageContentType(value));
}

export function isPagesRefinementSelected(selected: string[]) {
  return PAGE_CONTENT_TYPES.some((type) => selected.includes(type));
}

export function getAvailablePageContentTypes(items: RefinementItem[]) {
  return getPageRefinementItems(items)
    .filter((item) => item.count > 0)
    .map((item) => item.value);
}

/** Locations are only mixed into results when search is unfiltered or Pages-only. */
export function shouldIncludeLocationResultsInGlobalSearch(
  selectedContentTypes: string[],
) {
  if (selectedContentTypes.length === 0) {
    return true;
  }

  return selectedContentTypes.every(isPageContentType);
}

export function useClearStalePageRefinements({
  attribute,
  items,
  selectedItems,
  setIndexUiState,
  hasMatchingLocationResults = false,
}: {
  attribute: string;
  items: RefinementItem[];
  selectedItems: string[];
  setIndexUiState: ReturnType<typeof UseInstantSearch>['setIndexUiState'];
  hasMatchingLocationResults?: boolean;
}) {
  const isPagesSelected = isPagesRefinementSelected(selectedItems);

  useEffect(() => {
    if (
      !isPagesSelected ||
      hasVisiblePageRefinements(items, hasMatchingLocationResults)
    ) {
      return;
    }

    setIndexUiState((prevState) => {
      const currentSelected =
        (prevState?.refinementList?.[attribute] as string[]) || [];
      const nextSelected = withoutPageContentTypes(currentSelected);

      if (nextSelected.length === currentSelected.length) {
        return prevState;
      }

      return {
        ...prevState,
        refinementList: {
          ...prevState.refinementList,
          [attribute]: nextSelected,
        },
      };
    });
  }, [attribute, hasMatchingLocationResults, items, isPagesSelected, setIndexUiState]);
}
