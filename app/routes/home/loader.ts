// This Loader is currenlty being use for both Home and About pages
import { leaders } from "../about/components/leaders-data";
// import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import {
  fetchAuthorArticles,
  fetchPersonAliasGuid,
  fetchAuthorByPathname,
} from "~/lib/.server/author-utils";
import { calculateReadTime, createImageUrlFromGuid } from "~/lib/utils";
import { Author, AuthorArticleProps } from "../author/types";
import { formatDate } from "date-fns";

const getAuthorIdsByPathname = async (person: Author): Promise<string> => {
  try {
    const authorData = await fetchAuthorByPathname(
      person.authorAttributes.pathname
    );
    return authorData.primaryAliasId;
  } catch (error) {
    console.error("Error fetching author:", error);
    throw new Error(
      `Failed to fetch author ID for ${person.authorAttributes.pathname}`
    );
  }
};

// Grabs author data for the LeadersGrid and LeaderScroll components
export const loader = async () => {
  try {
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
            (
              authorArticles[index] as Array<{
                title: string;
                content: string;
                startDateTime: string;
                publishDate: string;
                coverImage: string;
                summary: string;
                attributeValues?: {
                  image?: { value: string };
                  summary?: { value: string };
                  url?: { value: string };
                };
              }>
            ).map(
              (article): AuthorArticleProps => ({
                title: article.title,
                readTime: calculateReadTime(article.content || ""),
                publishDate: formatDate(
                  new Date(article.startDateTime),
                  "MMMM d, yyyy"
                ),
                coverImage: article.attributeValues?.image?.value
                  ? createImageUrlFromGuid(article.attributeValues.image.value)
                  : "",
                summary: article.attributeValues?.summary?.value || "",
                url: article.attributeValues?.url?.value || "",
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

    return Response.json({
      leadersWithArticles,
      ...algoliaEnvs,
    });
  } catch (error) {
    console.error("Error in home loader:", error);
    // Return empty data structure to prevent page breakage
    return Response.json({
      leadersWithArticles: leaders.map((leader) => ({
        ...leader,
        authorAttributes: {
          ...leader.authorAttributes,
          publications: {
            articles: [],
            books: [],
            podcasts: [],
          },
        },
      })),
      ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
      ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
    });
  }
};
