import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export const CLASS_FINDER_PARAMS = {
  QUERY: "q",
} as const;

const REFINEMENT_LIST_ATTRIBUTES = [
  "campus",
  "topic",
  "language",
  "format",
] as const;

export type ClassFinderUrlState = AlgoliaUrlStateBase;

const {
  parse: parseClassFinderUrlState,
  toParams: classFinderUrlStateToParams,
  emptyState: classFinderEmptyState,
} = createAlgoliaUrlStateConfig<ClassFinderUrlState>({
  queryParamKey: CLASS_FINDER_PARAMS.QUERY,
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseClassFinderUrlState,
  classFinderUrlStateToParams,
  classFinderEmptyState,
};
