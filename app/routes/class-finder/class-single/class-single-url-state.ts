import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const CLASS_SINGLE_PARAMS = {
  QUERY: "q",
  PAGE: "page",
  LAT: "lat",
  LNG: "lng",
} as const;

export type ClassSingleUrlState = AlgoliaUrlStateBase & {
  lat?: number;
  lng?: number;
};

const REFINEMENT_LIST_ATTRIBUTES = [
  "campus.name",
  "format",
  "language",
] as const;

const {
  parse: parseClassSingleUrlState,
  toParams: classSingleUrlStateToParams,
  emptyState: classSingleEmptyState,
} = createAlgoliaUrlStateConfig<ClassSingleUrlState>({
  queryParamKey: CLASS_SINGLE_PARAMS.QUERY,
  pageParamKey: CLASS_SINGLE_PARAMS.PAGE,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
  custom: {
    parse(params) {
      const state: Partial<ClassSingleUrlState> = {};
      const lat = params.get(CLASS_SINGLE_PARAMS.LAT);
      const lng = params.get(CLASS_SINGLE_PARAMS.LNG);
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
        params.set(CLASS_SINGLE_PARAMS.LAT, String(state.lat));
        params.set(CLASS_SINGLE_PARAMS.LNG, String(state.lng));
      }
    },
  },
});

export {
  parseClassSingleUrlState,
  classSingleUrlStateToParams,
  classSingleEmptyState,
};
