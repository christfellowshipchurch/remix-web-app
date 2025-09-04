import { AuthorProps } from "../article-single/partials/hero.partial";

export type ArticlesReturnType = {
  ALGOLIA_APP_ID: string | undefined;
  ALGOLIA_SEARCH_API_KEY: string | undefined;
};

export const loader = async (): Promise<ArticlesReturnType> => {
  return {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  };
};
