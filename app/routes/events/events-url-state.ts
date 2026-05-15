import type { AlgoliaUrlStateBase } from '~/lib/algolia-url-state';
import { createAlgoliaUrlStateConfig } from '~/lib/algolia-url-state';

export const EVENTS_FINDER_PARAMS = {
  QUERY: 'q',
  PAGE: 'p',
} as const;

export type EventsFinderUrlState = AlgoliaUrlStateBase & {
  /** Algolia page index (0-based). Omitted in URL when 0. */
  page?: number;
};

const REFINEMENT_LIST_ATTRIBUTES = [
  'eventCategories',
  'eventLocations',
] as const;

const {
  parse: parseEventsFinderUrlState,
  toParams: eventsFinderUrlStateToParams,
  emptyState: eventsFinderEmptyState,
} = createAlgoliaUrlStateConfig<EventsFinderUrlState>({
  queryParamKey: EVENTS_FINDER_PARAMS.QUERY,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
  custom: {
    parse: (params) => {
      const raw = params.get(EVENTS_FINDER_PARAMS.PAGE);
      if (raw == null || raw === '') {
        return {};
      }
      const n = Number.parseInt(raw, 10);
      if (!Number.isFinite(n) || n < 0) {
        return {};
      }
      return { page: n };
    },
    toParams: (state, params) => {
      const page = state.page;
      if (page != null && page > 0) {
        params.set(EVENTS_FINDER_PARAMS.PAGE, String(page));
      }
    },
  },
});

export {
  parseEventsFinderUrlState,
  eventsFinderUrlStateToParams,
  eventsFinderEmptyState,
};
