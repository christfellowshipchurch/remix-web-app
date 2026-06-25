import { describe, expect, it } from 'vitest';

import { splitGroupTopics } from '../types';

describe('splitGroupTopics', () => {
  it('returns string arrays as trimmed tags', () => {
    expect(splitGroupTopics(['Bible Study', ' Prayer '])).toEqual([
      'Bible Study',
      'Prayer',
    ]);
  });

  it('still supports legacy comma-separated strings', () => {
    expect(splitGroupTopics('Bible Study, Prayer')).toEqual([
      'Bible Study',
      'Prayer',
    ]);
  });

  it('returns an empty array for missing or blank values', () => {
    expect(splitGroupTopics(null)).toEqual([]);
    expect(splitGroupTopics(undefined)).toEqual([]);
    expect(splitGroupTopics([])).toEqual([]);
    expect(splitGroupTopics('   ')).toEqual([]);
  });
});
