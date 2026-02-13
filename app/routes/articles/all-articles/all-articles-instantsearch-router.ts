/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B (routing). */

import type { MutableRefObject } from "react";
import type { AllArticlesUrlState } from "./all-articles-url-state";
import {
  parseAllArticlesUrlState,
  allArticlesUrlStateToParams,
} from "./all-articles-url-state";

const INDEX_NAME = "dev_contentItems";

export type AllArticlesRouterRefs = {
  searchParamsRef: MutableRefObject<URLSearchParams>;
  setSearchParamsRef: MutableRefObject<
    (
      params: URLSearchParams,
      options?: { replace?: boolean; preventScrollReset?: boolean }
    ) => void
  >;
  pathnameRef: MutableRefObject<string>;
  onUpdateCallbackRef: MutableRefObject<
    ((route: AllArticlesUrlState) => void) | null
  >;
};

export function createAllArticlesInstantSearchRouter(
  refs: AllArticlesRouterRefs
) {
  const {
    searchParamsRef,
    setSearchParamsRef,
    pathnameRef,
    onUpdateCallbackRef,
  } = refs;

  return {
    createURL(routeState: AllArticlesUrlState): string {
      const params = allArticlesUrlStateToParams(routeState);
      const qs = params.toString();
      const pathname = pathnameRef.current;
      return qs ? `${pathname}?${qs}` : pathname;
    },
    read(): AllArticlesUrlState {
      return parseAllArticlesUrlState(searchParamsRef.current);
    },
    write(routeState: AllArticlesUrlState): void {
      setSearchParamsRef.current(allArticlesUrlStateToParams(routeState), {
        replace: true,
        preventScrollReset: true,
      });
    },
    onUpdate(callback: (route: AllArticlesUrlState) => void): void {
      onUpdateCallbackRef.current = callback;
    },
    dispose(): void {
      onUpdateCallbackRef.current = null;
    },
  };
}

export function createAllArticlesStateMapping() {
  return {
    stateToRoute(uiState: { [indexId: string]: Record<string, unknown> }) {
      const idx = uiState[INDEX_NAME] || {};
      return {
        query: (idx.query as string) ?? undefined,
        refinementList:
          (idx.refinementList as Record<string, string[]>) ?? undefined,
      } as AllArticlesUrlState;
    },
    routeToState(routeState: AllArticlesUrlState) {
      return {
        [INDEX_NAME]: {
          query: routeState.query,
          refinementList: routeState.refinementList ?? {},
        },
      };
    },
  };
}
