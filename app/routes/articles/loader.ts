import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchRockData, getImages } from "~/lib/server/fetchRockData.server";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import { createImageUrlFromGuid } from "~/lib/utils";
import { getRelatedArticlesByContentItem } from "~/lib/server/fetchRelatedArticles.server";

export type LoaderReturnType = {
  hostUrl: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  author: AuthorProps;
  publishDate: string;
  readTime: number;
  relatedArticles?: {
    tag: string;
    tagId: string;
    articles: any[];
  };
};

const fetchArticleData = async (articlePath: string) => {
  return fetchRockData("ContentChannelItems/GetByAttributeValue", {
    attributeKey: "Url",
    value: articlePath,
    loadAttributes: "simple",
  });
};

const fetchAuthorId = async (authorId: string) => {
  return fetchRockData("PersonAlias", {
    $filter: `Guid eq guid'${authorId}'`,
    $select: "PersonId",
  });
};

export const fetchAuthorData = async ({ authorId }: { authorId: string }) => {
  return fetchRockData("People", {
    $filter: `Id eq ${authorId}`,
    $expand: "Photo",
    loadAttributes: "simple",
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

  const articleData = await fetchArticleData(articlePath);

  if (!articleData) {
    // This should stop execution and propagate the error to Remix's error boundary
    throw new Response("Article not found at: /articles/" + articlePath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { guid, title, content, createdDateTime, attributeValues, attributes } =
    articleData;

  const coverImage = getImages({ attributeValues, attributes });
  const { summary, author } = attributeValues;

  const authorDetails = await getAuthorDetails(author.value);

  const relatedArticles = await getRelatedArticlesByContentItem(guid);

  const pageData: LoaderReturnType = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    content,
    summary: summary.value,
    coverImage: coverImage[0],
    author: authorDetails,
    publishDate: format(new Date(createdDateTime), "d MMM yyyy"),
    readTime: Math.round(content.split(" ").length / 200),
    relatedArticles,
  };

  return json<LoaderReturnType>(pageData);
};
