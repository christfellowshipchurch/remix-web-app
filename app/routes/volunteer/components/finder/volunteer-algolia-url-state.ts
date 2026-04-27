import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const VOLUNTEER_FINDER_PARAMS = {
  QUERY: "q",
} as const;

export type VolunteerAlgoliaUrlState = AlgoliaUrlStateBase;

const REFINEMENT_LIST_ATTRIBUTES = ["category", "campusList"] as const;

const {
  parse: parseVolunteerAlgoliaUrlState,
  toParams: volunteerAlgoliaUrlStateToParams,
  emptyState: volunteerAlgoliaEmptyState,
} = createAlgoliaUrlStateConfig<VolunteerAlgoliaUrlState>({
  queryParamKey: VOLUNTEER_FINDER_PARAMS.QUERY,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseVolunteerAlgoliaUrlState,
  volunteerAlgoliaUrlStateToParams,
  volunteerAlgoliaEmptyState,
};
