import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const STUDIES_FINDER_PARAMS = {
  QUERY: "q",
} as const;

const REFINEMENT_LIST_ATTRIBUTES = [
  "duration",
  "audience",
  "source",
  "topic",
  "format",
] as const;

export type StudiesFinderUrlState = AlgoliaUrlStateBase;

const {
  parse: parseStudiesFinderUrlState,
  toParams: studiesFinderUrlStateToParams,
  emptyState: studiesFinderEmptyState,
} = createAlgoliaUrlStateConfig<StudiesFinderUrlState>({
  queryParamKey: STUDIES_FINDER_PARAMS.QUERY,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseStudiesFinderUrlState,
  studiesFinderUrlStateToParams,
  studiesFinderEmptyState,
};
