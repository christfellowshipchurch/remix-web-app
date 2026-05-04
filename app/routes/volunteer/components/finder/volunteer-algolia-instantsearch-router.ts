/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B (routing). */

import type { RefObject } from "react";
import type { VolunteerAlgoliaUrlState } from "./volunteer-algolia-url-state";
import {
  parseVolunteerAlgoliaUrlState,
  volunteerAlgoliaUrlStateToParams,
} from "./volunteer-algolia-url-state";
import { VOLUNTEER_ALGOLIA_INDEX } from "../../types";

export type VolunteerAlgoliaRouterRefs = {
  searchParamsRef: RefObject<URLSearchParams>;
  setSearchParamsRef: RefObject<
    (
      params: URLSearchParams,
      options?: { replace?: boolean; preventScrollReset?: boolean },
    ) => void
  >;
  pathnameRef: RefObject<string>;
  onUpdateCallbackRef: RefObject<
    ((route: VolunteerAlgoliaUrlState) => void) | null
  >;
};

export function createVolunteerAlgoliaInstantSearchRouter(
  refs: VolunteerAlgoliaRouterRefs,
) {
  const {
    searchParamsRef,
    setSearchParamsRef,
    pathnameRef,
    onUpdateCallbackRef,
  } = refs;

  return {
    createURL(routeState: VolunteerAlgoliaUrlState): string {
      const params = volunteerAlgoliaUrlStateToParams(routeState);
      const qs = params.toString();
      const pathname = pathnameRef.current;
      return qs ? `${pathname}?${qs}` : pathname;
    },
    read(): VolunteerAlgoliaUrlState {
      return parseVolunteerAlgoliaUrlState(searchParamsRef.current);
    },
    write(routeState: VolunteerAlgoliaUrlState): void {
      setSearchParamsRef.current(
        volunteerAlgoliaUrlStateToParams(routeState),
        {
          replace: true,
          preventScrollReset: true,
        },
      );
    },
    onUpdate(callback: (route: VolunteerAlgoliaUrlState) => void): void {
      onUpdateCallbackRef.current = callback;
    },
    dispose(): void {
      onUpdateCallbackRef.current = null;
    },
  };
}

export function createVolunteerAlgoliaStateMapping() {
  return {
    stateToRoute(uiState: { [indexId: string]: Record<string, unknown> }) {
      const idx = uiState[VOLUNTEER_ALGOLIA_INDEX] || {};
      return {
        query: (idx.query as string) ?? undefined,
        refinementList:
          (idx.refinementList as Record<string, string[]>) ?? undefined,
      } as VolunteerAlgoliaUrlState;
    },
    routeToState(routeState: VolunteerAlgoliaUrlState) {
      return {
        [VOLUNTEER_ALGOLIA_INDEX]: {
          query: routeState.query,
          refinementList: routeState.refinementList ?? {},
        },
      };
    },
  };
}
