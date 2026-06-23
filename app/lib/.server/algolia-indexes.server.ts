import { getAlgoliaIndexes } from '~/lib/algolia-indexes';

export function getServerAlgoliaIndexes() {
  return getAlgoliaIndexes(process.env.ALGOLIA_INDEX_ENV);
}
