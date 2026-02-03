/**
 * Reusable URL state utilities for Algolia InstantSearch pages.
 *
 * HOW TO REUSE FOR ANOTHER FINDER (e.g. class finder, event finder):
 * -----------------------------------------------------------------
 * 1. Define your URL state type extending AlgoliaUrlStateBase with any custom params:
 *    type MyFinderUrlState = AlgoliaUrlStateBase & { campus?: string; date?: string; ... };
 *
 * 2. Call createAlgoliaUrlStateConfig<MyFinderUrlState>({ ... }) with:
 *    - queryParamKey, pageParamKey: URL keys for query and page (e.g. 'q', 'page')
 *    - refinementAttributes: list of Algolia refinement list attribute names that
 *      are stored in the URL (one param per attribute, multi-value via repeated params)
 *    - custom: { parse(params) => partial state from custom params, toParams(state, params) => set custom params }
 *
 * 3. Use the returned parse() and toParams() with useAlgoliaUrlSync (see use-algolia-url-sync.ts).
 *
 * 4. In your search component:
 *    - On mount: initialUiState = urlStateToInitialUiState(parse(searchParams), indexName)
 *    - Keep a ref of "custom" state (things that are not in InstantSearch uiState, e.g. location, age)
 *    - On InstantSearch onStateChange: merge index uiState + custom ref -> toParams() -> debouncedUpdateUrl()
 *    - When user changes custom filters: update React state + mergeUrlState(partial)
 *    - When user clicks "Clear all": cancelDebounce(), set ref + state to empty, setSearchParams(toParams({})), bump InstantSearch key to remount
 *
 * 5. Sync from URL when user navigates back/forward: useEffect(() => { const s = parse(searchParams); ... setState(s); }, [searchParams])
 */

/** Base shape of URL state shared by all Algolia finders: query, page, refinementList. */
export type AlgoliaUrlStateBase = {
  query?: string;
  page?: number;
  refinementList?: Record<string, string[]>;
};

export type AlgoliaUrlStateConfig<T extends AlgoliaUrlStateBase> = {
  /** URL param key for the search query (e.g. 'q'). */
  queryParamKey: string;
  /** URL param key for the current page (e.g. 'page'). Algolia uses 0-based page; URL typically uses 1-based. */
  pageParamKey: string;
  /** Algolia refinement list attribute names to read/write as URL params (multi-value = repeated param). */
  refinementAttributes: readonly string[];
  /**
   * Optional custom URL params (e.g. campus, age, lat/lng).
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

/**
 * Create parse/toParams/emptyState for an Algolia finder with URL sync.
 * Use this in your finder's url-state module (e.g. group-finder-url-state.ts).
 *
 * @example
 * const { parse, toParams, emptyState } = createAlgoliaUrlStateConfig<GroupFinderUrlState>({
 *   queryParamKey: 'q',
 *   pageParamKey: 'page',
 *   refinementAttributes: ['meetingType', 'campus', 'topics', ...],
 *   custom: {
 *     parse: (params) => ({ campus: params.get('campus') ?? undefined, ... }),
 *     toParams: (state, params) => { if (state.campus) params.set('campus', state.campus); ... },
 *   },
 * });
 */
export function createAlgoliaUrlStateConfig<T extends AlgoliaUrlStateBase>(
  config: AlgoliaUrlStateConfig<T>
): AlgoliaUrlStateHandlers<T> {
  const { queryParamKey, pageParamKey, refinementAttributes, custom } = config;

  function parse(params: URLSearchParams): T {
    const state = {} as T;

    const q = params.get(queryParamKey);
    if (q) (state as AlgoliaUrlStateBase).query = q;

    const pageStr = params.get(pageParamKey);
    if (pageStr) {
      const p = parseInt(pageStr, 10);
      if (!isNaN(p) && p >= 1) (state as AlgoliaUrlStateBase).page = p;
    }

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
    if (base.page != null && base.page > 1) {
      params.set(pageParamKey, String(base.page));
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
