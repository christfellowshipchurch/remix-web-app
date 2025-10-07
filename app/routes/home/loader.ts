// This Loader is currenlty being use for both Home and About pages
import { leaders } from "../about/components/leaders-data";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { fetchAuthorArticles, fetchPersonAliasGuid } from "../author/loader";
import { calculateReadTime, createImageUrlFromGuid } from "~/lib/utils";
import { Author, AuthorArticleProps } from "../author/types";

const getAuthorIdsByPathname = async (person: Author): Promise<string> => {
  try {
    const authorData = await fetchRockData({
      endpoint: "People/GetByAttributeValue",
      queryParams: {
        attributeKey: "Pathname",
        value: person.authorAttributes.pathname,
        $select: "PrimaryAliasId",
      },
    });

    return authorData.primaryAliasId;
  } catch (error) {
    console.error("Error fetching author:", error);
    throw new Error(
      `Failed to fetch author ID for ${person.authorAttributes.pathname}`
    );
  }
};

// Grabs author data for the LeadersGrid and LeaderScroll components
export const loader = async (): Promise<{
  leadersWithArticles: Author[];
  ALGOLIA_APP_ID: string | undefined;
  ALGOLIA_SEARCH_API_KEY: string | undefined;
}> => {
  const authorIds = await Promise.all(leaders.map(getAuthorIdsByPathname));
  const authorGuids = await Promise.all(authorIds.map(fetchPersonAliasGuid));
  const authorArticles = await Promise.all(
    authorGuids.map(fetchAuthorArticles)
  );

  // Map each leader to their articles
  const leadersWithArticles = leaders.map((leader, index) => ({
    ...leader,
    authorAttributes: {
      ...leader.authorAttributes,
      publications: {
        articles:
          authorArticles[index].map(
            (article: any): AuthorArticleProps => ({
              title: article.title,
              readTime: calculateReadTime(article.content),
              publishDate: article.startDateTime,
              coverImage: createImageUrlFromGuid(
                article.attributeValues.image.value
              ),
              summary: article.attributeValues.summary.value,
              url: article.attributeValues.url.value,
            })
          ) || [],
        books: [],
        podcasts: [],
      },
    },
  }));

  // Grabs Algolia environment variables for the location search component
  const algoliaEnvs = {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  };

  return {
    leadersWithArticles,
    ...algoliaEnvs,
  };
};
