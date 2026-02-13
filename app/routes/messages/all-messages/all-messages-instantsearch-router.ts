/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B (routing). */

import type { MutableRefObject } from "react";
import type { AllMessagesUrlState } from "./all-messages-url-state";
import {
  parseAllMessagesUrlState,
  allMessagesUrlStateToParams,
} from "./all-messages-url-state";

const INDEX_NAME = "dev_contentItems";

export type AllMessagesRouterRefs = {
  searchParamsRef: MutableRefObject<URLSearchParams>;
  setSearchParamsRef: MutableRefObject<
    (
      params: URLSearchParams,
      options?: { replace?: boolean; preventScrollReset?: boolean }
    ) => void
  >;
  pathnameRef: MutableRefObject<string>;
  onUpdateCallbackRef: MutableRefObject<
    ((route: AllMessagesUrlState) => void) | null
  >;
};

export function createAllMessagesInstantSearchRouter(
  refs: AllMessagesRouterRefs
) {
  const {
    searchParamsRef,
    setSearchParamsRef,
    pathnameRef,
    onUpdateCallbackRef,
  } = refs;

  return {
    createURL(routeState: AllMessagesUrlState): string {
      const params = allMessagesUrlStateToParams(routeState);
      const qs = params.toString();
      const pathname = pathnameRef.current;
      return qs ? `${pathname}?${qs}` : pathname;
    },
    read(): AllMessagesUrlState {
      return parseAllMessagesUrlState(searchParamsRef.current);
    },
    write(routeState: AllMessagesUrlState): void {
      setSearchParamsRef.current(allMessagesUrlStateToParams(routeState), {
        replace: true,
        preventScrollReset: true,
      });
    },
    onUpdate(callback: (route: AllMessagesUrlState) => void): void {
      onUpdateCallbackRef.current = callback;
    },
    dispose(): void {
      onUpdateCallbackRef.current = null;
    },
  };
}

export function createAllMessagesStateMapping() {
  return {
    stateToRoute(uiState: { [indexId: string]: Record<string, unknown> }) {
      const idx = uiState[INDEX_NAME] || {};
      return {
        query: (idx.query as string) ?? undefined,
        refinementList:
          (idx.refinementList as Record<string, string[]>) ?? undefined,
      } as AllMessagesUrlState;
    },
    routeToState(routeState: AllMessagesUrlState) {
      return {
        [INDEX_NAME]: {
          query: routeState.query,
          refinementList: routeState.refinementList ?? {},
        },
      };
    },
  };
}
