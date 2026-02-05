/** All Articles URL state. See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 1. */

import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export type AllArticlesUrlState = AlgoliaUrlStateBase;

const REFINEMENT_LIST_ATTRIBUTES = ["articlePrimaryCategories"] as const;

const {
  parse: parseAllArticlesUrlState,
  toParams: allArticlesUrlStateToParams,
  emptyState: allArticlesEmptyState,
} = createAlgoliaUrlStateConfig<AllArticlesUrlState>({
  queryParamKey: "q",
  pageParamKey: "page",
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseAllArticlesUrlState,
  allArticlesUrlStateToParams,
  allArticlesEmptyState,
};
