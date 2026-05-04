// This Loader is currently used for both Home and About pages.
import type { LeaderProfile } from '~/routes/about/components/leaders-data';
import { buildLeadersWithBios, staticLeaders } from '~/lib/.server/build-leaders-with-bios';

export type HomeLoaderData = {
  leaders: LeaderProfile[];
  ALGOLIA_APP_ID?: string;
  ALGOLIA_SEARCH_API_KEY?: string;
};

export const loader = async (): Promise<Response> => {
  let leaders: LeaderProfile[];
  try {
    leaders = await buildLeadersWithBios();
  } catch {
    leaders = staticLeaders();
  }

  return Response.json({
    leaders,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  });
};
