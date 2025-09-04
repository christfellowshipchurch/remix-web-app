export type AllArticlesReturnType = {
  ALGOLIA_APP_ID: string | undefined;
  ALGOLIA_SEARCH_API_KEY: string | undefined;
};

export const loader = async (): Promise<AllArticlesReturnType> => {
  return {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  };
};
