import { leaders } from "~/routes/about/components/leaders-data";
import {
  fetchAuthorArticles,
  fetchAuthorByPathname,
  fetchPersonAliasGuid,
} from "~/lib/.server/author-utils";
import { calculateReadTime, createImageUrlFromGuid } from "~/lib/utils";
import { Author, AuthorArticleProps } from "~/routes/author/types";
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
      `Failed to fetch author ID for ${person.authorAttributes.pathname}`,
      { cause: error }
    );
  }
};

const emptyPublications = (): Author["authorAttributes"]["publications"] => ({
  articles: [],
  books: [],
  podcasts: [],
});

export async function buildLeadersWithArticles(): Promise<Author[]> {
  const authorIds = await Promise.all(leaders.map(getAuthorIdsByPathname));
  const authorGuids = await Promise.all(authorIds.map(fetchPersonAliasGuid));
  const authorArticles = await Promise.all(
    authorGuids.map(fetchAuthorArticles)
  );

  return leaders.map((leader, index) => ({
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
}

export function leadersWithEmptyArticles(): Author[] {
  return leaders.map((leader) => ({
    ...leader,
    authorAttributes: {
      ...leader.authorAttributes,
      publications: emptyPublications(),
    },
  }));
}
