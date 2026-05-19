import type { AlgoliaUrlStateBase } from '~/lib/algolia-url-state';
import { createAlgoliaUrlStateConfig } from '~/lib/algolia-url-state';

export const CLASS_SINGLE_PARAMS = {
  QUERY: 'q',
  LAT: 'lat',
  LNG: 'lng',
} as const;

export type ClassSingleUrlState = AlgoliaUrlStateBase & {
  lat?: number;
  lng?: number;
};

/** Repeated `campus` query params ↔ InstantSearch `refinementList.campus`. */
const REFINEMENT_LIST_ATTRIBUTES = ['campus', 'format', 'language'] as const;

const {
  parse: parseClassSingleUrlState,
  toParams: classSingleUrlStateToParams,
  emptyState: classSingleEmptyState,
} = createAlgoliaUrlStateConfig<ClassSingleUrlState>({
  queryParamKey: CLASS_SINGLE_PARAMS.QUERY,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
  custom: {
    parse(params) {
      const state: Partial<ClassSingleUrlState> = {};
      const latRaw = params.get(CLASS_SINGLE_PARAMS.LAT);
      const lngRaw = params.get(CLASS_SINGLE_PARAMS.LNG);
      if (latRaw != null && lngRaw != null) {
        const lat = Number.parseFloat(latRaw);
        const lng = Number.parseFloat(lngRaw);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          state.lat = lat;
          state.lng = lng;
        }
      }
      return state;
    },
    toParams(state, params) {
      if (
        state.lat != null &&
        state.lng != null &&
        Number.isFinite(state.lat) &&
        Number.isFinite(state.lng)
      ) {
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

export function coordinatesFromClassSingleUrlState(
  urlState: ClassSingleUrlState,
): { lat: number; lng: number } | null {
  if (
    urlState.lat != null &&
    urlState.lng != null &&
    Number.isFinite(urlState.lat) &&
    Number.isFinite(urlState.lng)
  ) {
    return { lat: urlState.lat, lng: urlState.lng };
  }
  return null;
}
