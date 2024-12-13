import type { LoaderFunction } from "react-router";
import { fetchRockData, getImages } from "~/lib/.server/fetchRockData";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import { createImageUrlFromGuid } from "~/lib/utils";
import { getRelatedArticlesByContentItem } from "~/lib/.server/fetchRelatedArticles";

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
};

const fetchArticleData = async (articlePath: string) => {
  const rockData = await fetchRockData(
    "ContentChannelItems/GetByAttributeValue",
    {
      attributeKey: "Url",
      $filter: "Status eq '2' and ContentChannelId eq 43",
      value: articlePath,
      loadAttributes: "simple",
    }
  );

  if (rockData.length > 1) {
    console.error(
      `More than one article was found with the same path: /articles/${articlePath}`
    );
    return rockData[0];
  }

  return rockData;
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
  };

  return <LoaderReturnType>pageData;
};
