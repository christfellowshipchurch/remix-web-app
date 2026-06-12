import {
  ALGOLIA_INDEX_NAMES,
  getAlgoliaIndexes,
  normalizeAlgoliaIndexEnv,
} from '../algolia-indexes';

describe('algolia index naming', () => {
  it('resolves dev index names', () => {
    expect(getAlgoliaIndexes('dev')).toEqual({
      contentItems: 'dev_webv3_ContentItems',
      groups: 'dev_webv3_Groups',
      classes: 'dev_webv3_Classes',
      locations: 'dev_webv3_Locations',
      missions: 'dev_webv3_Missions',
      studiesAndResources: 'dev_webv3_StudiesAndResources',
      eventFinderItems: 'dev_webv3_EventFinderItems',
    });
  });

  it('resolves prod index names', () => {
    expect(getAlgoliaIndexes('prod')).toEqual({
      contentItems: 'prod_webv3_ContentItems',
      groups: 'prod_webv3_Groups',
      classes: 'prod_webv3_Classes',
      locations: 'prod_webv3_Locations',
      missions: 'prod_webv3_Missions',
      studiesAndResources: 'prod_webv3_StudiesAndResources',
      eventFinderItems: 'prod_webv3_EventFinderItems',
    });
  });

  it('defaults missing or unrecognized environments to dev', () => {
    expect(normalizeAlgoliaIndexEnv(undefined)).toBe('dev');
    expect(normalizeAlgoliaIndexEnv(null)).toBe('dev');
    expect(normalizeAlgoliaIndexEnv('staging')).toBe('dev');
    expect(getAlgoliaIndexes(undefined).contentItems).toBe(
      'dev_webv3_ContentItems',
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
