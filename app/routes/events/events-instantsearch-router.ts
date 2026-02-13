import type { MutableRefObject } from "react";
import type { EventsFinderUrlState } from "./events-url-state";
import {
  parseEventsFinderUrlState,
  eventsFinderUrlStateToParams,
} from "./events-url-state";

const INDEX_NAME = "dev_contentItems";

export type EventsRouterRefs = {
  searchParamsRef: MutableRefObject<URLSearchParams>;
  setSearchParamsRef: MutableRefObject<
    (
      params: URLSearchParams,
      options?: { replace?: boolean; preventScrollReset?: boolean }
    ) => void
  >;
  pathnameRef: MutableRefObject<string>;
  onUpdateCallbackRef: MutableRefObject<
    ((route: EventsFinderUrlState) => void) | null
  >;
};

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B step 2 (router). */
export function createEventsInstantSearchRouter(refs: EventsRouterRefs) {
  const {
    searchParamsRef,
    setSearchParamsRef,
    pathnameRef,
    onUpdateCallbackRef,
  } = refs;

  return {
    createURL(routeState: EventsFinderUrlState): string {
      const params = eventsFinderUrlStateToParams(routeState);
      const qs = params.toString();
      const pathname = pathnameRef.current;
      return qs ? `${pathname}?${qs}` : pathname;
    },
    read(): EventsFinderUrlState {
      return parseEventsFinderUrlState(searchParamsRef.current);
    },
    write(routeState: EventsFinderUrlState): void {
      setSearchParamsRef.current(eventsFinderUrlStateToParams(routeState), {
        replace: true,
        preventScrollReset: true,
      });
    },
    onUpdate(callback: (route: EventsFinderUrlState) => void): void {
      onUpdateCallbackRef.current = callback;
    },
    dispose(): void {
      onUpdateCallbackRef.current = null;
    },
  };
}

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B step 2 (state mapping). */
export function createEventsStateMapping() {
  return {
    stateToRoute(uiState: { [indexId: string]: Record<string, unknown> }) {
      const idx = uiState[INDEX_NAME] || {};
      return {
        query: (idx.query as string) ?? undefined,
        refinementList:
          (idx.refinementList as Record<string, string[]>) ?? undefined,
      } as EventsFinderUrlState;
    },
    routeToState(routeState: EventsFinderUrlState) {
      return {
        [INDEX_NAME]: {
          query: routeState.query,
          refinementList: routeState.refinementList ?? {},
        },
      };
    },
  };
}
