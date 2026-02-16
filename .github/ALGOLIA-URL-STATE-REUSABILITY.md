# Reusability: Adding URL-driven search to another finder

This guide describes how to add the same URL-driven search state to a **new** Algolia-based search page (e.g. another finder, events list, content search). There are **two patterns**; choose based on whether the standard approach keeps results and filter UI in sync.

Implementation files reference this doc with "§" (e.g. "§ Pattern A step 1") so you can jump to the matching section.

## Which pattern to use

- **Pattern A (recommended first):** `initialUiState` + `onStateChange` + `useAlgoliaUrlSync`. Use this when all filter state lives in InstantSearch (refinementList, query, page) or you have a small amount of custom state (e.g. coordinates, age) that you keep in a ref and merge when syncing to the URL. **Reference:** Group Finder, Class Finder, Class Finder single (upcoming sessions).
- **Pattern B (use if Pattern A fails):** InstantSearch **routing** with a custom router that reads/writes React Router's URL. Use this when with Pattern A the URL updates but **results and/or filter UI do not update** (InstantSearch and URL get out of sync). **Reference:** Events finder.

Try Pattern A first; only add the custom router (Pattern B) if you observe the URL changing without results/UI updating.

---

## Pattern A: initialUiState + onStateChange + useAlgoliaUrlSync

**1. Create a url-state module for your finder**

- Add a new file, e.g. `app/routes/your-finder/your-finder-url-state.ts`.
- Define your URL state type, extending `AlgoliaUrlStateBase` with any custom params (e.g. `campus`, `age`, `lat`, `lng`):

  ```ts
  import type { AlgoliaUrlStateBase } from "~/lib/algolia-url-state";
  import { createAlgoliaUrlStateConfig } from "~/lib/algolia-url-state";

  export type YourFinderUrlState = AlgoliaUrlStateBase & {
    campus?: string;
    lat?: number;
    lng?: number;
    // ... any custom keys
  };
  ```

- Define URL param key constants (e.g. `q`, `page`) and the list of **Algolia refinement list attribute names** that should appear in the URL (e.g. `['meetingType', 'campus', 'topics']`). Multi-value = same param repeated.
- Call `createAlgoliaUrlStateConfig<YourFinderUrlState>({ ... })` with:
  - `queryParamKey` — e.g. `'q'`.
  - `pageParamKey` — e.g. `'page'` (URL is 1-based; InstantSearch uses 0-based internally).
  - `refinementAttributes` — array of attribute names that map to refinementList in UI state.
  - `custom` (optional) — `{ parse(params) => partial state, toParams(state, params) => set params }` for any param that is not query, page, or refinementList (e.g. campus, lat, lng, age).
- Export `parse`, `toParams`, and `emptyState` (and param constants if useful).

**Group Finder example:** `app/routes/group-finder/group-finder-url-state.ts` — `GroupFinderUrlState` (campus, age, lat, lng), `GROUP_FINDER_PARAMS`, `REFINEMENT_LIST_ATTRIBUTES`, `createAlgoliaUrlStateConfig` with `custom.parse`/`custom.toParams` for campus/age/lat/lng, exports `parseGroupFinderUrlState`, `groupFinderUrlStateToParams`, `groupFinderEmptyState`.

**2. Wire the search component to the URL**

- In the component that renders `<InstantSearch>` (e.g. your finder's main search partial):
  - Get `[searchParams, setSearchParams]` from `useSearchParams()` and, if you need pathname for links, `useLocation()`.
  - Call `useAlgoliaUrlSync({ searchParams, setSearchParams, toParams: yourFinderUrlStateToParams, debounceMs: 400 })` to get `debouncedUpdateUrl`, `cancelDebounce`, and optionally `updateUrlIfChanged`.
  - Build **initial state from URL once on mount:** `const initial = useMemo(() => getInitialStateFromUrl(searchParams), []);` where `getInitialStateFromUrl(searchParams)`:
    - Calls `parse(searchParams)` to get url state.
    - Builds `initialUiState[indexName]` with `query`, `page` (convert 1-based URL → 0-based), and `refinementList` from the parsed state.
    - If you have custom state (coordinates, age, campus, etc.), also return that as initial React state (e.g. `coordinates`, `ageInput`, `selectedLocation`).
  - Initialize React state from `initial` (e.g. `useState(initial.coordinates)`, `useState(initial.ageInput)`).
  - If you have custom state that is not in InstantSearch's uiState, keep it in a **ref** as well (e.g. `customStateRef.current = { coordinates, ageInput, selectedLocation }`) so that when you sync to the URL you can merge index uiState + custom state into one urlState object.

**Group Finder example:** `app/routes/group-finder/partials/group-search.partial.tsx` — `useSearchParams()`, `useAlgoliaUrlSync({ toParams: groupFinderUrlStateToParams, debounceMs: 400 })`; `getInitialStateFromUrl(searchParams)` returns `coordinates`, `ageInput`, `selectedLocation`, `initialUiState` (query, 1→0-based page, refinementList); `useState(initial.*)` for each; `customStateRef` updated each render with current `coordinates`, `ageInput`, `selectedLocation`.

**3. Pass initialUiState and onStateChange to InstantSearch**

- Compute `initialUiState` for `<InstantSearch>`:
  - If you use a "Clear All" remount (e.g. `instantSearchKey`), when `instantSearchKey > 0` pass something like `{ [indexName]: {} }` so the remount starts empty; otherwise pass `initial.initialUiState` when the URL had any state (so first load or direct link restores state).
- Pass `initialUiState={...}` and `onStateChange={({ uiState }) => { ... } }` to `<InstantSearch>`.
- In `onStateChange`: read `uiState[indexName]`, build a full urlState object (index's query, page, refinementList plus `customStateRef.current`), then call `debouncedUpdateUrl(urlState)`.

**Group Finder example:** `group-search.partial.tsx` — `<InstantSearch key={instantSearchKey} initialUiState={instantSearchKey > 0 ? { [INDEX_NAME]: {} } : initial.initialUiState} onStateChange={...} />`; `syncUrlFromUiState(indexUiState)` merges index uiState with `customStateRef.current` (campus, age, lat/lng) and calls `debouncedUpdateUrl(urlState)`.

**4. Keep custom state in sync with the URL**

- When the user changes a custom filter (e.g. location, age, campus): update your React state and call `debouncedUpdateUrl(mergedState)` with the full state (InstantSearch state + your custom state). You can read current InstantSearch state from the ref or from the last `onStateChange` if you store it.
- When the URL changes externally (e.g. back/forward): run a `useEffect` that depends on `searchParams`, call `parse(searchParams)`, and update your custom React state (e.g. set coordinates, age, campus) so the UI reflects the URL.

**Group Finder example:** `group-search.partial.tsx` — `mergeUrlState(partial)` merges `parseGroupFinderUrlState(searchParams)` with `partial` and calls `debouncedUpdateUrl(merged)`; used by `setCoordinates`, `setAgeInput` (and campus when selected). Back/forward: `useEffect([searchParams])` calls `parseGroupFinderUrlState(searchParams)` and updates `setCoordinatesState`, `setAgeInputState`, `setSelectedLocationState`.

**5. Clear All**

- In your Clear All handler (toolbar or inside a popup):
  - Call `cancelDebounce()` first so a pending debounced write does not overwrite the cleared URL.
  - Clear your custom state (setState and ref).
  - Call `setSearchParams(toParams(emptyState), { replace: true, preventScrollReset: true })`.
  - If you use a key to remount InstantSearch on clear, run `setInstantSearchKey((k) => k + 1)` so the next render remounts `<InstantSearch>` with empty `initialUiState`.
- Optionally use the shared **`AlgoliaFinderClearAllButton`** (`app/routes/group-finder/components/clear-all-button.component.tsx`): it clears InstantSearch uiState (query, refinementList, page) and calls an `onClearAllToUrl` prop where you do `cancelDebounce`, `setSearchParams(toParams(emptyState))`, and key bump if needed.

**Group Finder example:** `group-search.partial.tsx` — `clearAllFiltersFromUrl()` calls `cancelDebounce()`, clears `customStateRef` and all related `setState`s, `setSearchParams(groupFinderUrlStateToParams(groupFinderEmptyState), { replace: true, preventScrollReset: true })`, then `setInstantSearchKey((k) => k + 1)`. Passed to `<AlgoliaFinderClearAllButton onClearAllToUrl={clearAllFiltersFromUrl} />` in toolbar (XL) and inside All Filters popup (MD/LG).

**6. URL update options**

- Use `replace: true` and `preventScrollReset: true` when calling `setSearchParams` so filter/search changes don't add a new history entry per keystroke and don't scroll the page.
- The hook's internal `updateUrlIfChanged` only calls `setSearchParams` when the serialized state string differs from the current URL, which avoids unnecessary updates.

**Group Finder example:** `useAlgoliaUrlSync` is called with default `replace: true`, `preventScrollReset: true`; all `setSearchParams` calls in Group Finder use `{ replace: true, preventScrollReset: true }` (e.g. in `clearAllFiltersFromUrl` and inside the hook).

**Checklist for Pattern A**

- [ ] New file: `app/routes/<finder>/<finder>-url-state.ts` with type, param constants, `createAlgoliaUrlStateConfig`, and exported parse/toParams/emptyState.
- [ ] Search component: `useSearchParams`, `useAlgoliaUrlSync(toParams, debounceMs: 400)`.
- [ ] `getInitialStateFromUrl(searchParams)` and `useMemo(..., [])` for initial; build `initialUiState` and optional custom initial state.
- [ ] Ref for custom state; `onStateChange` → merge index uiState + ref → `debouncedUpdateUrl`.
- [ ] Custom filter handlers update state and call `debouncedUpdateUrl(mergedState)`.
- [ ] `useEffect([searchParams])` to sync custom state from URL (back/forward).
- [ ] Clear All: `cancelDebounce()`, clear state/ref, `setSearchParams(toParams(emptyState), { replace: true, preventScrollReset: true })`, optional key bump and use of `AlgoliaFinderClearAllButton`.

---

## Pattern B: InstantSearch routing with a custom router (when Pattern A doesn't keep UI in sync)

Use this when the URL updates but results and/or filter UI do not (e.g. refinement list or dropdown selection doesn't update). The URL must become the **single source of truth** via InstantSearch's `routing` prop.

**1. Create a url-state module (same as Pattern A)**

- Same as Pattern A step 1: `your-finder-url-state.ts` with `createAlgoliaUrlStateConfig`, parse, toParams, emptyState. No custom router yet.

**2. Create a custom router and state mapping**

- Add a new file, e.g. `app/routes/your-finder/your-finder-instantsearch-router.ts`.
- **State mapping:** Implement an object with:
  - `stateToRoute(uiState)` — takes InstantSearch's full uiState (keyed by index name), returns your URL state shape (query, 1-based page, refinementList, etc.). Extract `uiState[indexName]` and convert page from 0-based to 1-based.
  - `routeToState(routeState)` — takes the URL state shape, returns InstantSearch uiState: `{ [indexName]: { query, page: 0-based, refinementList } }`.
- **Router:** Implement an object that the InstantSearch routing middleware can call:
  - `read()` — return current route state; use a **ref** that holds the latest `searchParams` and return `parseYourFinderUrlState(searchParamsRef.current)`.
  - `write(routeState)` — call `setSearchParamsRef.current(toParams(routeState), { replace: true, preventScrollReset: true })`.
  - `createURL(routeState)` — return the full URL string for links (e.g. `pathnameRef.current + '?' + toParams(routeState).toString()`).
  - `onUpdate(callback)` — store the callback in a ref (e.g. `onUpdateCallbackRef.current = callback`). The middleware will call this when the URL should drive state (e.g. back/forward); you will also call it when your app changes the URL (e.g. Clear All).
  - `dispose()` — set the callback ref to `null`.
- The router must be created with refs (searchParams, setSearchParams, pathname, onUpdate callback) so it always sees the latest values. **Reference:** `app/routes/events/events-instantsearch-router.ts`.

**3. Wire the search component to the router**

- In the component that renders `<InstantSearch>`:
  - Create refs: `searchParamsRef`, `setSearchParamsRef`, `pathnameRef` (from `useLocation().pathname`), `onUpdateCallbackRef`. Keep them updated in the render body (e.g. `searchParamsRef.current = searchParams`).
  - `useMemo` to create the router: `createYourFinderInstantSearchRouter({ searchParamsRef, setSearchParamsRef, pathnameRef, onUpdateCallbackRef })`.
  - `useMemo` to create the state mapping (no dependencies or stable deps).
  - Pass **`routing={{ router, stateMapping }}`** to `<InstantSearch>`. Do **not** pass `initialUiState` or `onStateChange` for URL sync (routing replaces them).
  - **Critical:** When the URL changes (e.g. user clicked back, or you called `setSearchParams` for Clear All), you must notify InstantSearch. Add a `useEffect` that depends on `searchParams` and, inside it, call `onUpdateCallbackRef.current?.(parseYourFinderUrlState(searchParams))`. That calls the middleware's callback with the new route state so InstantSearch updates its internal state from the URL.

**4. Clear All with Pattern B**

- Clear All only needs to call `setSearchParams(toParams(emptyState), { replace: true, preventScrollReset: true })`. No key bump and no `cancelDebounce` (you are not debouncing writes; the router writes immediately). The `useEffect` on `searchParams` will run and call the router's `onUpdate` callback, so InstantSearch state (and thus results and filter UI) will clear.

**Checklist for Pattern B**

- [ ] Url-state module (same as Pattern A).
- [ ] Router module: `stateToRoute` / `routeToState` and router object with `read`, `write`, `createURL`, `onUpdate`, `dispose`; refs for searchParams, setSearchParams, pathname, and onUpdate callback.
- [ ] Search component: refs kept up to date; `routing={{ router, stateMapping }}` on `<InstantSearch>`; no `initialUiState`/`onStateChange` for URL; `useEffect([searchParams])` that calls `onUpdateCallbackRef.current(parse(searchParams))`.
- [ ] Clear All: `setSearchParams(toParams(emptyState), { replace: true, preventScrollReset: true })`; optional use of `AlgoliaFinderClearAllButton` with `onClearAllToUrl` that only does that.

---

## Shared pieces used by both patterns

- **`app/lib/algolia-url-state.ts`** — Use `createAlgoliaUrlStateConfig` for every new finder's url-state module. Defines the contract (query, page, refinementList, optional custom keys) and gives you parse/toParams/emptyState.
- **`app/hooks/use-algolia-url-sync.ts`** — Use only for **Pattern A**. Not used with Pattern B (the custom router writes to the URL directly).
- **`app/routes/group-finder/components/clear-all-button.component.tsx`** — Reusable "Clear all" button: clears InstantSearch uiState and calls `onClearAllToUrl`. Use for both patterns; in `onClearAllToUrl`, implement the appropriate Clear All steps (Pattern A: cancelDebounce + setSearchParams + optional key bump; Pattern B: setSearchParams only).

---

## Quick reference: files to copy or mirror

| Goal                          | Reference files                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Url-state module              | `group-finder-url-state.ts`, `class-finder-url-state.ts`, `events-url-state.ts`, `class-single-url-state.ts` |
| Pattern A (sync in component) | `group-search.partial.tsx`, `class-search.partial.tsx`, Class Single upcoming sections (desktop + mobile)    |
| Pattern B (custom router)     | `events-instantsearch-router.ts`, `all-events/partials/all-events.tsx` (Events)                              |
| Clear All button              | `clear-all-button.component.tsx`; usage in Group/Class/Events finders and Class Single                       |
