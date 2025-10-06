// Grabs author data for the LeadersGrid and LeaderScroll components
export const loader = async (): Promise<{
  ALGOLIA_APP_ID: string | undefined;
  ALGOLIA_SEARCH_API_KEY: string | undefined;
}> => {
  // Grabs Algolia environment variables for the location search component
  const algoliaEnvs = {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  };

  return { ...algoliaEnvs };
};
