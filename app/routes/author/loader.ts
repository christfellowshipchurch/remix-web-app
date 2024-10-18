import { json, LoaderFunction } from "@remix-run/node";
import { fetchRockData } from "~/lib/server/fetchRockData.server";
import { createImageUrlFromGuid } from "~/lib/utils";
import { fetchAuthorData } from "../articles/loader";

type SocialMedia = {
  type: string;
  url: string;
};

export type LoaderReturnType = {
  hostUrl: string;
  fullName: string;
  profilePhoto: string;
  authorAttributes: {
    bio: string;
    jobTitle: string;
    socialLinks: SocialMedia[];
    publications: {
      title: string;
      readTime: number;
      publishDate: string;
      coverImage: string;
      summary: string;
      url: string;
    };
  };
};

export const fetchPersonAliasGuid = async (primaryAliasId: string) => {
  const personAlias: any = await fetchRockData("PersonAlias", {
    $filter: `Id eq ${primaryAliasId}`,
  });

  return personAlias?.guid;
};
export const fetchArticlesByAttributeValue = async (
  personAliasGuid: string
) => {
  const articles = await fetchRockData(
    "ContentChannelItems/GetByAttributeValue",
    {
      attributeKey: "Author",
      value: personAliasGuid,
      loadAttributes: "simple",
    }
  );

  return articles;
};

const getAuthorDetails = async (personId: string) => {
  const authorData = await fetchAuthorData({
    authorId: personId,
  });

  // Get the author's GUID
  const personAliasGuid = await fetchPersonAliasGuid(
    authorData?.primaryAliasId
  );

  // Get articles by the author
  const authorArticles = await fetchArticlesByAttributeValue(personAliasGuid);

  // Get the author's social links
  const socialLinks = [
    { url: authorData?.attributeValues?.twitter.value, type: "twitter" },
    { url: authorData?.attributeValues?.facebook.value, type: "facebook" },
    { url: authorData?.attributeValues?.instagram.value, type: "instagram" },
    { url: authorData?.attributeValues?.linkedIn.value, type: "linkedIn" },
  ];

  return {
    fullName: `${authorData.firstName} ${authorData.lastName}`,
    photo: {
      uri: createImageUrlFromGuid(authorData.photo?.guid),
    },
    authorAttributes: {
      bio: authorData?.attributeValues?.authorBio?.value,
      authorId: personId,
      jobTitle: authorData?.attributeValues?.jobTitle?.value,
      socialLinks: socialLinks,
      publications: authorArticles,
    },
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const authorId = params?.authorId || "";

  const data = await getAuthorDetails(authorId);

  if (!data) {
    // This should stop execution and propagate the error to Remix's error boundary
    throw new Response("Author not found at: /author/" + authorId, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const authorData: LoaderReturnType = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    fullName: data.fullName,
    profilePhoto: data.photo.uri,
    authorAttributes: data.authorAttributes,
  };

  return json<LoaderReturnType>(authorData);
};
