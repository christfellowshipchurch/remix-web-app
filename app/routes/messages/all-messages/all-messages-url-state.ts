/** All Messages URL state. See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 1. */

import type { AlgoliaUrlStateBase } from '~/lib/algolia-url-state';
import { createAlgoliaUrlStateConfig } from '~/lib/algolia-url-state';

const PAGE_QUERY_KEY = 'page';

export type AllMessagesUrlState = AlgoliaUrlStateBase & {
  /** 0-based Algolia page; omitted from URL on first page */
  page?: number;
};

const REFINEMENT_LIST_ATTRIBUTES = ['sermonPrimaryCategories'] as const;

const {
  parse: parseAllMessagesUrlState,
  toParams: allMessagesUrlStateToParams,
  emptyState: allMessagesEmptyState,
} = createAlgoliaUrlStateConfig<AllMessagesUrlState>({
  queryParamKey: 'q',
  refinementAttributes: REFINEMENT_LIST_ATTRIBUTES,
  custom: {
    parse(params) {
      const raw = params.get(PAGE_QUERY_KEY);
      if (!raw) return {};
      const n = parseInt(raw, 10);
      if (!Number.isFinite(n) || n < 2) return {};
      return { page: n - 1 };
    },
    toParams(state, params) {
      const p = state.page;
      if (p != null && p > 0) {
        params.set(PAGE_QUERY_KEY, String(p + 1));
      }
    },
  },
});

export {
  parseAllMessagesUrlState,
  allMessagesUrlStateToParams,
  allMessagesEmptyState,
};
