/** Group Finder URL state. See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 1. */

import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const GROUP_FINDER_PARAMS = {
  QUERY: "q",
  PAGE: "page",
  CAMPUS: "campus",
  AGE: "age",
  LAT: "lat",
  LNG: "lng",
  MEETING_TYPE: "meetingType",
  GROUP_FOR: "groupFor",
  PEOPLE_WHO_ARE: "peopleWhoAre",
  TOPICS: "topics",
  MEETING_DAYS: "meetingDays",
  MEETING_FREQUENCY: "meetingFrequency",
  ADULT_ONLY: "adultOnly",
  LANGUAGE: "language",
} as const;

export type GroupFinderUrlState = AlgoliaUrlStateBase & {
  campus?: string;
  age?: string;
  lat?: number;
  lng?: number;
};

const REFINEMENT_LIST_ATTRIBUTES = [
  "meetingType",
  "campus",
  "groupFor",
  "peopleWhoAre",
  "topics",
  "meetingDays",
  "meetingFrequency",
  "adultOnly",
  "language",
] as const;

const {
  parse: parseGroupFinderUrlState,
  toParams: groupFinderUrlStateToParams,
  emptyState: groupFinderEmptyState,
} = createAlgoliaUrlStateConfig<GroupFinderUrlState>({
  queryParamKey: GROUP_FINDER_PARAMS.QUERY,
  pageParamKey: GROUP_FINDER_PARAMS.PAGE,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
  custom: {
    parse(params) {
      const state: Partial<GroupFinderUrlState> = {};
      const campus = params.get(GROUP_FINDER_PARAMS.CAMPUS);
      if (campus) state.campus = campus;
      const age = params.get(GROUP_FINDER_PARAMS.AGE);
      if (age) state.age = age;
      const lat = params.get(GROUP_FINDER_PARAMS.LAT);
      const lng = params.get(GROUP_FINDER_PARAMS.LNG);
      if (lat && lng) {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        if (!isNaN(latNum) && !isNaN(lngNum)) {
          state.lat = latNum;
          state.lng = lngNum;
        }
      }
      return state;
    },
    toParams(state, params) {
      if (state.campus?.trim()) {
        params.set(GROUP_FINDER_PARAMS.CAMPUS, state.campus.trim());
      }
      if (state.age?.trim()) {
        params.set(GROUP_FINDER_PARAMS.AGE, state.age.trim());
      }
      if (state.lat != null && state.lng != null) {
        params.set(GROUP_FINDER_PARAMS.LAT, String(state.lat));
        params.set(GROUP_FINDER_PARAMS.LNG, String(state.lng));
      }
    },
  },
});

export {
  parseGroupFinderUrlState,
  groupFinderUrlStateToParams,
  groupFinderEmptyState,
};
