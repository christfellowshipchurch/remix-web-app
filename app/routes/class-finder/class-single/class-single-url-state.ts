import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const CLASS_SINGLE_PARAMS = {
  QUERY: "q",
} as const;

export type ClassSingleUrlState = AlgoliaUrlStateBase;

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
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseClassSingleUrlState,
  classSingleUrlStateToParams,
  classSingleEmptyState,
};
