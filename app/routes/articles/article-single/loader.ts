import { type LoaderFunction } from "react-router-dom";
import { fetchRockData, getImages } from "~/lib/.server/fetch-rock-data";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import { createImageUrlFromGuid } from "~/lib/utils";
import { getRelatedArticlesByContentItem } from "~/lib/.server/fetch-related-articles";
import { articleCategories } from "../all-articles/all-articles-page";

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
    articles: any[];
  };
  isCategory: boolean;
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

const isCategory = (path: string) => {
  return articleCategories.some((category) => category.path === path);
};

const fetchAuthorId = async (authorId: string) => {
  return fetchRockData({
    endpoint: "PersonAlias",
    queryParams: {
      $filter: `Guid eq guid'${authorId}'`,
      $select: "PersonId",
    },
  });
};

export const fetchAuthorData = async ({ authorId }: { authorId: string }) => {
  return fetchRockData({
    endpoint: "People",
    queryParams: {
      $filter: `Id eq ${authorId}`,
      $expand: "Photo",
      loadAttributes: "simple",
    },
  });
};

export const getAuthorDetails = async (authorId: string) => {
  const { personId } = await fetchAuthorId(authorId);
  const authorData = await fetchAuthorData({ authorId: personId });

  return {
    fullName: `${authorData.firstName} ${authorData.lastName}`,
    photo: {
      uri: createImageUrlFromGuid(authorData.photo?.guid),
    },
    authorAttributes: {
      authorId: personId,
    },
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const articlePath = params?.path || "";

  if (isCategory(articlePath)) {
    return {
      isCategory: true,
      title: articlePath,
    };
  }

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
    authorDetails = await getAuthorDetails(author.value);
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

    // TODO: Update this to check path to see if it's an article or a category page
    isCategory: isCategory(articlePath),
  };

  return pageData;
};
