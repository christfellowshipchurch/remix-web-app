export type AlgoliaIndexEnv = 'dev' | 'prod';

export type AlgoliaIndexName =
  | 'contentItems'
  | 'groups'
  | 'classes'
  | 'locations'
  | 'missions'
  | 'missionsPrivate'
  | 'studiesAndResources'
  | 'eventFinderItems';

export type AlgoliaIndexMap = Record<AlgoliaIndexName, string>;

export const ALGOLIA_INDEX_NAMES = [
  'contentItems',
  'groups',
  'classes',
  'locations',
  'missions',
  'missionsPrivate',
  'studiesAndResources',
  'eventFinderItems',
] as const satisfies readonly AlgoliaIndexName[];

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
    ALGOLIA_INDEX_NAMES.map((name) => [name, `${normalizedEnv}_webv3_${name}`]),
  ) as AlgoliaIndexMap;
}

export const DEFAULT_ALGOLIA_INDEXES = getAlgoliaIndexes(undefined);
