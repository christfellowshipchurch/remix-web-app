import type { RefObject } from 'react';
import type { EventsFinderUrlState } from './events-url-state';
import {
  parseEventsFinderUrlState,
  eventsFinderUrlStateToParams,
} from './events-url-state';
import { EVENTS_INDEX } from './all-events/components/events-tags-refinement.component';

export type EventsRouterRefs = {
  searchParamsRef: RefObject<URLSearchParams>;
  setSearchParamsRef: RefObject<
    (
      params: URLSearchParams,
      options?: { replace?: boolean; preventScrollReset?: boolean },
    ) => void
  >;
  pathnameRef: RefObject<string>;
  onUpdateCallbackRef: RefObject<
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
      const idx = uiState[EVENTS_INDEX] || {};
      const rawPage = idx.page;
      const pageNum =
        typeof rawPage === 'number' && Number.isFinite(rawPage)
          ? Math.max(0, Math.floor(rawPage))
          : 0;
      return {
        query: (idx.query as string) ?? undefined,
        refinementList:
          (idx.refinementList as Record<string, string[]>) ?? undefined,
        page: pageNum > 0 ? pageNum : undefined,
      } as EventsFinderUrlState;
    },
    routeToState(routeState: EventsFinderUrlState) {
      return {
        [EVENTS_INDEX]: {
          query: routeState.query,
          refinementList: routeState.refinementList ?? {},
          page: routeState.page ?? 0,
        },
      };
    },
  };
}
