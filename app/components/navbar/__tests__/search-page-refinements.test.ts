import { describe, expect, it } from 'vitest';

import {
  getAvailablePageContentTypes,
  hasVisiblePageRefinements,
  isPagesRefinementSelected,
  shouldIncludeLocationResultsInGlobalSearch,
  withoutPageContentTypes,
} from '../search-page-refinements';

describe('search page refinements', () => {
  const items = [
    { value: 'Ministry Page', count: 2 },
    { value: 'Page Builder', count: 0 },
    { value: 'Redirect Card', count: 1 },
    { value: 'Article', count: 4 },
  ];

  it('hides pages when no page facets have hits', () => {
    expect(
      hasVisiblePageRefinements([
        { value: 'Ministry Page', count: 0 },
        { value: 'Page Builder', count: 0 },
        { value: 'Redirect Card', count: 0 },
      ]),
    ).toBe(false);
    expect(hasVisiblePageRefinements(items)).toBe(true);
  });

  it('shows pages when campus location results match the query', () => {
    expect(
      hasVisiblePageRefinements(
        [
          { value: 'Ministry Page', count: 0 },
          { value: 'Page Builder', count: 0 },
          { value: 'Redirect Card', count: 0 },
        ],
        true,
      ),
    ).toBe(true);
  });

  it('selects only page facets that currently have hits', () => {
    expect(getAvailablePageContentTypes(items)).toEqual([
      'Ministry Page',
      'Redirect Card',
    ]);
  });

  it('tracks and clears grouped page refinements', () => {
    const selected = ['Article', 'Ministry Page', 'Redirect Card'];

    expect(isPagesRefinementSelected(selected)).toBe(true);
    expect(withoutPageContentTypes(selected)).toEqual(['Article']);
  });

  it('only includes locations when search is unfiltered or pages-only', () => {
    expect(shouldIncludeLocationResultsInGlobalSearch([])).toBe(true);
    expect(
      shouldIncludeLocationResultsInGlobalSearch([
        'Ministry Page',
        'Page Builder',
      ]),
    ).toBe(true);
    expect(shouldIncludeLocationResultsInGlobalSearch(['Sermon'])).toBe(false);
    expect(
      shouldIncludeLocationResultsInGlobalSearch(['Sermon', 'Ministry Page']),
    ).toBe(false);
  });
});
