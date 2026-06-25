import { describe, expect, it } from 'vitest';

import {
  ALGOLIA_INDEX_NAMES,
  getAlgoliaIndexes,
  normalizeAlgoliaIndexEnv,
} from '../algolia-indexes';

describe('algolia index naming', () => {
  it('resolves dev index names', () => {
    expect(getAlgoliaIndexes('dev')).toEqual({
      contentItems: 'dev_webv3_contentItems',
      groups: 'dev_webv3_groups',
      classes: 'dev_webv3_classes',
      locations: 'dev_webv3_locations',
      missions: 'dev_webv3_missions',
      studiesAndResources: 'dev_webv3_studiesAndResources',
      eventFinderItems: 'dev_webv3_eventFinderItems',
    });
  });

  it('resolves prod index names', () => {
    expect(getAlgoliaIndexes('prod')).toEqual({
      contentItems: 'prod_webv3_contentItems',
      groups: 'prod_webv3_groups',
      classes: 'prod_webv3_classes',
      locations: 'prod_webv3_locations',
      missions: 'prod_webv3_missions',
      studiesAndResources: 'prod_webv3_studiesAndResources',
      eventFinderItems: 'prod_webv3_eventFinderItems',
    });
  });

  it('defaults missing or unrecognized environments to dev', () => {
    expect(normalizeAlgoliaIndexEnv(undefined)).toBe('dev');
    expect(normalizeAlgoliaIndexEnv(null)).toBe('dev');
    expect(normalizeAlgoliaIndexEnv('staging')).toBe('dev');
    expect(getAlgoliaIndexes(undefined).contentItems).toBe(
      'dev_webv3_contentItems',
    );
  });

  it('includes every logical index key used by the app', () => {
    expect([...ALGOLIA_INDEX_NAMES].sort()).toEqual(
      [
        'classes',
        'contentItems',
        'eventFinderItems',
        'groups',
        'locations',
        'missions',
        'studiesAndResources',
      ].sort(),
    );
  });
});
