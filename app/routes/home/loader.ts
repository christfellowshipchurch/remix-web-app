// This Loader is currently used for both Home and About pages.
// Leader articles are loaded on demand via /home-leaders-articles when the leadership section is near the viewport.
import type { Author } from "~/routes/author/types";
import { leadersWithEmptyArticles } from "~/lib/.server/build-leaders-with-articles";

export type HomeLoaderData = {
  leadersWithArticles: Author[];
  ALGOLIA_APP_ID?: string;
  ALGOLIA_SEARCH_API_KEY?: string;
};

export const loader = async (): Promise<Response> => {
  const leadersWithArticles = leadersWithEmptyArticles();

  return Response.json({
    leadersWithArticles,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  });
};
