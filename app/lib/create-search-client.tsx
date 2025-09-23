import { algoliasearch } from "algoliasearch";

export const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});
