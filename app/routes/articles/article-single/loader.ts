import { type LoaderFunction } from "react-router-dom";
import { fetchRockData, getImages } from "~/lib/.server/fetch-rock-data";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import {
  FormattedArticle,
  getRelatedArticlesByContentItem,
} from "~/lib/.server/fetch-related-articles";
import { CollectionItem } from "~/routes/page-builder/types";
import { getBasicAuthorInfoFlexible } from "~/lib/.server/author-utils";

// Mapping function to convert FormattedArticle to CollectionItem
const mapFormattedArticleToCollectionItem = (
  article: FormattedArticle
): CollectionItem & { authorProps?: AuthorProps } => {
  const authorProps: AuthorProps | undefined = {
    fullName: `${
      article?.author?.fullName
        ? article?.author?.fullName
        : `Christ Fellowship Team`
    }`,
    photo: (article.author as { photo?: { uri: string } }).photo,
    authorAttributes: (
      article.author as {
        authorAttributes?: { authorId: string; pathname: string };
      }
    ).authorAttributes,
  };

  return {
    id: article.url || "",
    name: article.title,
    summary: article.summary || "",
    image: Array.isArray(article.coverImage) ? article.coverImage[0] : "",
    pathname: article.url || "",
    startDate: article.publishDate,
    author:
      typeof article.author === "object" && article.author
        ? `${
            (article.author as { firstName?: string; lastName?: string })
              .firstName || ""
          } ${
            (article.author as { firstName?: string; lastName?: string })
              .lastName || ""
          }`.trim()
        : String(article.author || ""),
    readTime: article.readTime,
    contentChannelId: "43",
    contentType: "ARTICLES" as const,
    authorProps,
  };
};

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

  const { guid, title, content, startDateTime, attributeValues, attributes } =
    articleData;

  const coverImage = getImages({ attributeValues, attributes });
  const { summary, author } = attributeValues;

  let authorDetails = null;
  if (author?.value) {
    authorDetails = await getBasicAuthorInfoFlexible(author.value);
  }

  const relatedArticlesData = await getRelatedArticlesByContentItem(guid);

  const pageData: LoaderReturnType = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    content,
    summary: summary.value,
    coverImage: coverImage[0],
    author: authorDetails,
    publishDate: format(new Date(startDateTime), "d MMM yyyy"),
    readTime: Math.round(content.split(" ").length / 200),
    relatedArticles: relatedArticlesData
      ? {
          tag: relatedArticlesData.tag,
          tagId: relatedArticlesData.tagId,
          articles: relatedArticlesData.articles.map(
            mapFormattedArticleToCollectionItem
          ),
        }
      : undefined,
  };

  return pageData;
};
