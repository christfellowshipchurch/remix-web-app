import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const EVENTS_FINDER_PARAMS = {
  QUERY: "q",
  PAGE: "page",
} as const;

export type EventsFinderUrlState = AlgoliaUrlStateBase;

const REFINEMENT_LIST_ATTRIBUTES = ["eventTags", "locations.name"] as const;

const {
  parse: parseEventsFinderUrlState,
  toParams: eventsFinderUrlStateToParams,
  emptyState: eventsFinderEmptyState,
} = createAlgoliaUrlStateConfig<EventsFinderUrlState>({
  queryParamKey: EVENTS_FINDER_PARAMS.QUERY,
  pageParamKey: EVENTS_FINDER_PARAMS.PAGE,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseEventsFinderUrlState,
  eventsFinderUrlStateToParams,
  eventsFinderEmptyState,
};
