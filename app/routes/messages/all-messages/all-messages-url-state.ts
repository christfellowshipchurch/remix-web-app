/** All Messages URL state. See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 1. */

import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

export type AllMessagesUrlState = AlgoliaUrlStateBase;

const REFINEMENT_LIST_ATTRIBUTES = ["sermonPrimaryCategories"] as const;

const {
  parse: parseAllMessagesUrlState,
  toParams: allMessagesUrlStateToParams,
  emptyState: allMessagesEmptyState,
} = createAlgoliaUrlStateConfig<AllMessagesUrlState>({
  queryParamKey: "q",
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
});

export {
  parseAllMessagesUrlState,
  allMessagesUrlStateToParams,
  allMessagesEmptyState,
};
