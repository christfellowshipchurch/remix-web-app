/**
 * URL param keys for group finder search state.
 * Used for shareable / bookmarkable search URLs.
 */
export const GROUP_FINDER_PARAMS = {
  QUERY: "q",
  PAGE: "page",
  CAMPUS: "campus",
  AGE: "age",
  LAT: "lat",
  LNG: "lng",
  // Refinement list attributes (Algolia)
  MEETING_TYPE: "meetingType",
  CAMPUS_REFINEMENT: "campus", // same as CAMPUS for Configure filter
  GROUP_FOR: "groupFor",
  PEOPLE: "people",
  PEOPLE_WHO_ARE: "peopleWhoAre",
  TOPICS: "topics",
  MEETING_DAYS: "meetingDays",
  MEETING_FREQUENCY: "meetingFrequency",
  ADULT_ONLY: "adultOnly",
  LANGUAGE: "language",
} as const;

const REFINEMENT_LIST_ATTRIBUTES = [
  "meetingType",
  "campus",
  "groupFor",
  "people",
  "peopleWhoAre",
  "topics",
  "meetingDays",
  "meetingFrequency",
  "adultOnly",
  "language",
] as const;

export type GroupFinderUrlState = {
  query?: string;
  page?: number;
  campus?: string;
  age?: string;
  lat?: number;
  lng?: number;
  refinementList?: Record<string, string[]>;
};

/**
 * Parse URLSearchParams into GroupFinderUrlState.
 * Used on load and when the user uses browser back/forward.
 */
export function parseGroupFinderUrlState(
  searchParams: URLSearchParams
): GroupFinderUrlState {
  const state: GroupFinderUrlState = {};

  const q = searchParams.get(GROUP_FINDER_PARAMS.QUERY);
  if (q) state.query = q;

  const page = searchParams.get(GROUP_FINDER_PARAMS.PAGE);
  if (page) {
    const p = parseInt(page, 10);
    if (!isNaN(p) && p >= 1) state.page = p;
  }

  const campus = searchParams.get(GROUP_FINDER_PARAMS.CAMPUS);
  if (campus) state.campus = campus;

  const age = searchParams.get(GROUP_FINDER_PARAMS.AGE);
  if (age) state.age = age;

  const lat = searchParams.get(GROUP_FINDER_PARAMS.LAT);
  const lng = searchParams.get(GROUP_FINDER_PARAMS.LNG);
  if (lat && lng) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      state.lat = latNum;
      state.lng = lngNum;
    }
  }

  const refinementList: Record<string, string[]> = {};
  for (const attr of REFINEMENT_LIST_ATTRIBUTES) {
    const values = searchParams.getAll(attr);
    if (values.length > 0) {
      refinementList[attr] = values;
    }
  }
  if (Object.keys(refinementList).length > 0) {
    state.refinementList = refinementList;
  }

  return state;
}

/**
 * Build URLSearchParams from GroupFinderUrlState.
 * Omits empty/default values so URLs stay clean.
 */
export function groupFinderUrlStateToParams(
  state: GroupFinderUrlState
): URLSearchParams {
  const params = new URLSearchParams();

  if (state.query?.trim()) {
    params.set(GROUP_FINDER_PARAMS.QUERY, state.query.trim());
  }
  if (state.page != null && state.page > 1) {
    params.set(GROUP_FINDER_PARAMS.PAGE, String(state.page));
  }
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
  if (state.refinementList) {
    for (const [attr, values] of Object.entries(state.refinementList)) {
      for (const v of values) {
        if (v) params.append(attr, v);
      }
    }
  }

  return params;
}
