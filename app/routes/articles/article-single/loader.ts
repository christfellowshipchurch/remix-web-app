import { type LoaderFunction } from "react-router-dom";
import { fetchRockData, getImages } from "~/lib/.server/fetch-rock-data";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import { getRelatedArticlesByContentItem } from "~/lib/.server/fetch-related-articles";
import { getBasicAuthorInfoFlexible } from "~/lib/.server/author-utils";

export type LoaderReturnType = {
  hostUrl: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  author: AuthorProps | null;
  publishDate: string;
  readTime: number;
  relatedArticles?: {
    tag: string;
    tagId: string;
    articles: {
      id: number;
      title: string;
      summary: string;
      coverImage: string;
      publishDate: string;
      readTime: number;
    }[];
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

  const { guid, title, content, startDateTime, attributeValues, attributes } =
    articleData;

  const coverImage = getImages({ attributeValues, attributes });
  const { summary, author } = attributeValues;

  let authorDetails = null;
  if (author?.value) {
    authorDetails = await getBasicAuthorInfoFlexible(author.value);
  }

  const relatedArticles = await getRelatedArticlesByContentItem(guid);

  const pageData: LoaderReturnType = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    content,
    summary: summary.value,
    coverImage: coverImage[0],
    author: authorDetails,
    publishDate: format(new Date(startDateTime), "d MMM yyyy"),
    readTime: Math.round(content.split(" ").length / 200),
    relatedArticles,
  };

  return pageData;
};
