import { type LoaderFunction } from "react-router-dom";
import { fetchRockData, getImages } from "~/lib/.server/fetch-rock-data";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import { CollectionItem } from "~/routes/page-builder/types";
import { getBasicAuthorInfoFlexible } from "~/lib/.server/author-utils";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  hostUrl: string;
  title: string;
  id: string;
  content: string;
  summary: string;
  coverImage: string;
  author: AuthorProps | null;
  publishDate: string;
  readTime: number;
  articlePrimaryCategories: string[];
  relatedArticles?: {
    tag: string;
    tagId: string;
    articles: (CollectionItem & { authorProps?: AuthorProps })[];
  };
};

const fetchArticleData = async (articlePath: string) => {
  try {
    const rockData = await fetchRockData({
      endpoint: "ContentChannelItems/GetByAttributeValue",
      queryParams: {
        attributeKey: "Url",
        $filter: "ContentChannelId eq 43 and Status eq 'Approved'",
        value: articlePath,
        loadAttributes: "simple",
      },
    });

    if (!rockData || rockData.length === 0) {
      return null;
    }

    if (rockData.length > 1) {
      console.error(
        `More than one article was found with the same path: /articles/${articlePath}`
      );
      return rockData[0];
    }

    return rockData;
  } catch (error) {
    console.error("Error fetching article data:", error);
    throw new Response(
      `Failed to fetch article data for path: ${articlePath}`,
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  const articlePath = params?.path || "";

  const articleData = await fetchArticleData(articlePath);
  if (!articleData) {
    throw new Response("Article not found at: /articles/" + articlePath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { title, content, startDateTime, attributeValues, attributes } =
    articleData;

  const articlePrimaryCategories =
    attributeValues.primaryCategory?.valueFormatted.split(",");
  const coverImage = getImages({ attributeValues, attributes });
  const { summary, author } = attributeValues;

  let authorDetails: AuthorProps | null = null;
  if (author?.value) {
    authorDetails = (await getBasicAuthorInfoFlexible(
      author.value
    )) as AuthorProps;
  }

  const pageData: LoaderReturnType = {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID || "",
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY || "",
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    id: articleData.id,
    content,
    summary: summary.value,
    coverImage: coverImage[0],
    author: {
      fullName: authorDetails?.fullName || "",
      photo: {
        uri: authorDetails?.photo?.uri || "",
      },
      authorAttributes: authorDetails?.authorAttributes || undefined,
    },
    publishDate: format(new Date(startDateTime), "d MMM yyyy"),
    readTime: Math.max(1, Math.round(content.split(" ").length / 200)),
    articlePrimaryCategories,
  };

  return pageData;
};
