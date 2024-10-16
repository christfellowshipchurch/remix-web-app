import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchRockData, getImages } from "~/lib/server/fetchRockData.server";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import { createImageUrlFromGuid } from "~/lib/utils";

export type LoaderReturnType = {
  hostUrl: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  author: AuthorProps;
  publishDate: string;
  readTime: number;
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

const fetchAuthorData = async (authorId: string) => {
  return fetchRockData("People", {
    $filter: `Id eq ${authorId}`,
    $expand: "Photo",
  });
};

const getAuthorDetails = async (authorId: string) => {
  const { personId } = await fetchAuthorId(authorId);
  const authorData = await fetchAuthorData(personId);

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
    throw new Error(
      "Article not found at the following path: /articles/" + articlePath
    );
  }

  const { title, content, createdDateTime, attributeValues, attributes } =
    articleData;

  const coverImage = await getImages({ attributeValues, attributes });
  const { summary, author } = attributeValues;

  const authorDetails = await getAuthorDetails(author.value);

  const pageData: LoaderReturnType = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    content,
    summary: summary.value,
    coverImage: coverImage[0],
    author: authorDetails,
    publishDate: format(new Date(createdDateTime), "d MMM yyyy"),
    readTime: Math.round(content.split(" ").length / 200),
  };

  return json<LoaderReturnType>(pageData);
};
