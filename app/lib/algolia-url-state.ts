/**
 * Reusable URL state utilities for Algolia InstantSearch pages.
 * See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 1 (url-state module).
 */

/** Base shape of URL state shared by all Algolia finders: query, refinementList. Page is not synced to URL. */
export type AlgoliaUrlStateBase = {
  query?: string;
  refinementList?: Record<string, string[]>;
};

export type AlgoliaUrlStateConfig<T extends AlgoliaUrlStateBase> = {
  /** URL param key for the search query (e.g. 'q'). */
  queryParamKey: string;
  /** Algolia refinement list attribute names to read/write as URL params (multi-value = repeated param). */
  refinementAttributes: readonly string[];
  /**
   * Optional custom URL params (e.g. campus, age).
   * parse: read custom params from URLSearchParams into a partial T.
   * toParams: write custom fields from state into the URLSearchParams (called after base params are set).
   */
  custom?: {
    parse: (params: URLSearchParams) => Partial<T>;
    toParams: (state: T, params: URLSearchParams) => void;
  };
};

export type AlgoliaUrlStateHandlers<T extends AlgoliaUrlStateBase> = {
  /** Parse URLSearchParams into your URL state type. Use on load and when searchParams change (e.g. back/forward). */
  parse: (params: URLSearchParams) => T;
  /** Build URLSearchParams from state. Use when updating the URL (debounced) and when clearing (empty state). */
  toParams: (state: T) => URLSearchParams;
  /** Empty state object. Use for "Clear all" to get clean params: toParams(emptyState). */
  emptyState: T;
};

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern A step 1. */
export function createAlgoliaUrlStateConfig<T extends AlgoliaUrlStateBase>(
  config: AlgoliaUrlStateConfig<T>
): AlgoliaUrlStateHandlers<T> {
  const { queryParamKey, refinementAttributes, custom } = config;

  function parse(params: URLSearchParams): T {
    const state = {} as T;

    const q = params.get(queryParamKey);
    if (q) (state as AlgoliaUrlStateBase).query = q;

    const refinementList: Record<string, string[]> = {};
    for (const attr of refinementAttributes) {
      const values = params.getAll(attr);
      if (values.length > 0) refinementList[attr] = values;
    }
    if (Object.keys(refinementList).length > 0) {
      (state as AlgoliaUrlStateBase).refinementList = refinementList;
    }

    if (custom) {
      Object.assign(state, custom.parse(params));
    }

    return state;
  }

  function toParams(state: T): URLSearchParams {
    const params = new URLSearchParams();
    const base = state as AlgoliaUrlStateBase;

    if (base.query?.trim()) {
      params.set(queryParamKey, base.query.trim());
    }
    if (base.refinementList) {
      for (const [attr, values] of Object.entries(base.refinementList)) {
        for (const v of values) {
          if (v) params.append(attr, v);
        }
      }
    }

    if (custom) {
      custom.toParams(state, params);
    }

    return params;
  }

  const emptyState = {} as T;

  return { parse, toParams, emptyState };
}
