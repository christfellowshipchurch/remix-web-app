/**
 * Group Finder URL state: parse/serialize search and filter state to the URL.
 *
 * This module uses the reusable helpers from ~/lib/algolia-url-state.ts. To build a similar
 * URL sync for another Algolia finder (e.g. class finder, events), copy this pattern and
 * define your own param keys, refinement attributes, and custom parse/toParams.
 *
 */

import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

/** URL param keys used by the group finder. Exported so other code can reference them if needed. */
export const GROUP_FINDER_PARAMS = {
  QUERY: "q",
  PAGE: "page",

  // Refinement list attributes use the same name as the Algolia attribute in the URL - INDEX UNIQUE
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

/**
 * Full URL state type for the group finder.
 * Base (query, page, refinementList) is shared with other finders; the rest is specific to groups.
 */
export type GroupFinderUrlState = AlgoliaUrlStateBase & {
  campus?: string;
  age?: string;
  lat?: number;
  lng?: number;
};

/** Algolia refinement list attributes that we persist in the URL (multi-value via repeated params). */
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
