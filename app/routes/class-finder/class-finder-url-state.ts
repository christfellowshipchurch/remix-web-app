import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const CLASS_FINDER_PARAMS = {
  QUERY: "q",
  PAGE: "page",
  LAT: "lat",
  LNG: "lng",
} as const;

const REFINEMENT_LIST_ATTRIBUTES = [
  "campus",
  "topic",
  "language",
  "format",
] as const;

export type ClassFinderUrlState = AlgoliaUrlStateBase & {
  lat?: number;
  lng?: number;
};

const {
  parse: parseClassFinderUrlState,
  toParams: classFinderUrlStateToParams,
  emptyState: classFinderEmptyState,
} = createAlgoliaUrlStateConfig<ClassFinderUrlState>({
  queryParamKey: CLASS_FINDER_PARAMS.QUERY,
  pageParamKey: CLASS_FINDER_PARAMS.PAGE,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
  custom: {
    parse(params) {
      const state: Partial<ClassFinderUrlState> = {};
      const lat = params.get(CLASS_FINDER_PARAMS.LAT);
      const lng = params.get(CLASS_FINDER_PARAMS.LNG);
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
      if (state.lat != null && state.lng != null) {
        params.set(CLASS_FINDER_PARAMS.LAT, String(state.lat));
        params.set(CLASS_FINDER_PARAMS.LNG, String(state.lng));
      }
    },
  },
});

export {
  parseClassFinderUrlState,
  classFinderUrlStateToParams,
  classFinderEmptyState,
};
