import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchRockData, getImages } from "~/lib/server/fetchRockData.server";
import { AuthorProps } from "./partials/hero.partial";
import { format } from "date-fns";
import { createImageUrlFromGuid } from "~/lib/utils";

export type LoaderReturnType = {
  hostUrl: string; // Host URL for the share links
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  author: AuthorProps;
  publishDate: string;
  readTime: number;
};

const fetchArticleData = async (articlePath: string) => {
  const data = await fetchRockData("ContentChannelItems/GetByAttributeValue", {
    attributeKey: "Url",
    value: articlePath,
    loadAttributes: "simple",
  });

  return data;
};

const fetchAuthorId = async (authorId: string) => {
  const data = await fetchRockData("PersonAlias", {
    $filter: `Guid eq guid'${authorId}'`,
    $select: "PersonId",
  });

  return data;
};

const fetchAuthorData = async (authorId: string) => {
  const data = await fetchRockData("People", {
    $filter: `Id eq ${authorId}`,
    $expand: "Photo",
  });

  return data;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<ReturnType<typeof json<LoaderReturnType>>> => {
  const articlePath = params?.path || "";

  const { title, content, createdDateTime, attributeValues, attributes } =
    await fetchArticleData(articlePath);

  const coverImage = await getImages({ attributeValues, attributes });

  const { summary, author } = attributeValues;

  const { personId } = await fetchAuthorId(author.value);
  const authorData = await fetchAuthorData(personId);

  const pageData: LoaderReturnType = {
    title,
    content,
    summary: summary.value,
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    coverImage: coverImage[0],
    author: {
      fullName: `${authorData.firstName} ${authorData.lastName}`,
      photo: {
        uri: createImageUrlFromGuid(authorData.photo?.guid),
      },
      authorAttributes: {
        authorId: personId,
      },
    },
    publishDate: format(new Date(createdDateTime), "d MMM yyyy"),
    readTime: Math.round(content.split(" ").length / 200),
  };

  // Return the data as JSON
  return json<LoaderReturnType>(pageData);
};
