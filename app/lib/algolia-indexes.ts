export type AlgoliaIndexEnv = 'dev' | 'prod';

export type AlgoliaIndexName =
  | 'contentItems'
  | 'groups'
  | 'classes'
  | 'locations'
  | 'missions'
  | 'studiesAndResources'
  | 'eventFinderItems';

export type AlgoliaIndexMap = Record<AlgoliaIndexName, string>;

const INDEX_BASE_NAMES = {
  contentItems: 'ContentItems',
  groups: 'Groups',
  classes: 'Classes',
  locations: 'Locations',
  missions: 'Missions',
  studiesAndResources: 'StudiesAndResources',
  eventFinderItems: 'EventFinderItems',
} as const satisfies Record<AlgoliaIndexName, string>;

export const ALGOLIA_INDEX_NAMES = Object.keys(
  INDEX_BASE_NAMES,
) as AlgoliaIndexName[];

export function normalizeAlgoliaIndexEnv(
  env: string | null | undefined,
): AlgoliaIndexEnv {
  return env === 'prod' ? 'prod' : 'dev';
}

export function getAlgoliaIndexes(
  env: string | null | undefined,
): AlgoliaIndexMap {
  const normalizedEnv = normalizeAlgoliaIndexEnv(env);

  return Object.fromEntries(
    ALGOLIA_INDEX_NAMES.map((name) => [
      name,
      `${normalizedEnv}_webv3_${INDEX_BASE_NAMES[name]}`,
    ]),
  ) as AlgoliaIndexMap;
}

export const DEFAULT_ALGOLIA_INDEXES = getAlgoliaIndexes(undefined);
