/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B (routing). */

import type { RefObject } from "react";
import type { VolunteerMissionsUrlState } from "./volunteer-missions-url-state";
import {
  parseVolunteerMissionsUrlState,
  volunteerMissionsUrlStateToParams,
} from "./volunteer-missions-url-state";
import { VOLUNTEER_MISSIONS_ALGOLIA_INDEX } from "./mission.types";

export type VolunteerMissionsRouterRefs = {
  searchParamsRef: RefObject<URLSearchParams>;
  setSearchParamsRef: RefObject<
    (
      params: URLSearchParams,
      options?: { replace?: boolean; preventScrollReset?: boolean },
    ) => void
  >;
  pathnameRef: RefObject<string>;
  onUpdateCallbackRef: RefObject<
    ((route: VolunteerMissionsUrlState) => void) | null
  >;
};

export function createVolunteerMissionsInstantSearchRouter(
  refs: VolunteerMissionsRouterRefs,
) {
  const {
    searchParamsRef,
    setSearchParamsRef,
    pathnameRef,
    onUpdateCallbackRef,
  } = refs;

  return {
    createURL(routeState: VolunteerMissionsUrlState): string {
      const params = volunteerMissionsUrlStateToParams(routeState);
      const qs = params.toString();
      const pathname = pathnameRef.current;
      return qs ? `${pathname}?${qs}` : pathname;
    },
    read(): VolunteerMissionsUrlState {
      return parseVolunteerMissionsUrlState(searchParamsRef.current);
    },
    write(routeState: VolunteerMissionsUrlState): void {
      setSearchParamsRef.current(volunteerMissionsUrlStateToParams(routeState), {
        replace: true,
        preventScrollReset: true,
      });
    },
    onUpdate(callback: (route: VolunteerMissionsUrlState) => void): void {
      onUpdateCallbackRef.current = callback;
    },
    dispose(): void {
      onUpdateCallbackRef.current = null;
    },
  };
}

export function createVolunteerMissionsStateMapping() {
  return {
    stateToRoute(uiState: { [indexId: string]: Record<string, unknown> }) {
      const idx = uiState[VOLUNTEER_MISSIONS_ALGOLIA_INDEX] || {};
      return {
        query: (idx.query as string) ?? undefined,
        refinementList:
          (idx.refinementList as Record<string, string[]>) ?? undefined,
      } as VolunteerMissionsUrlState;
    },
    routeToState(routeState: VolunteerMissionsUrlState) {
      return {
        [VOLUNTEER_MISSIONS_ALGOLIA_INDEX]: {
          query: routeState.query,
          refinementList: routeState.refinementList ?? {},
        },
      };
    },
  };
}
