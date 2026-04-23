import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const VOLUNTEER_MISSIONS_FINDER_PARAMS = {
  QUERY: "q",
} as const;

export type VolunteerMissionsUrlState = AlgoliaUrlStateBase;

const REFINEMENT_LIST_ATTRIBUTES = ["category", "campusList"] as const;

const {
  parse: parseVolunteerMissionsUrlState,
  toParams: volunteerMissionsUrlStateToParams,
  emptyState: volunteerMissionsEmptyState,
} = createAlgoliaUrlStateConfig<VolunteerMissionsUrlState>({
  queryParamKey: VOLUNTEER_MISSIONS_FINDER_PARAMS.QUERY,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseVolunteerMissionsUrlState,
  volunteerMissionsUrlStateToParams,
  volunteerMissionsEmptyState,
};
