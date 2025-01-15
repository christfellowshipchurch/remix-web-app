import { LoaderFunction } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { fetchAuthorData } from "../articles/article-single/loader";
import { AuthorArticleProps } from "./components/author-content";
import { format } from "date-fns";

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
    publications: AuthorArticleProps[];
  };
};

export const fetchPersonAliasGuid = async (primaryAliasId: string) => {
  const personAlias: any = await fetchRockData("PersonAlias", {
    $filter: `Id eq ${primaryAliasId}`,
  });

  return personAlias?.guid;
};
export const fetchAuthorArticles = async (personAliasGuid: string) => {
  const articles = await fetchRockData(
    "ContentChannelItems/GetByAttributeValue",
    {
      attributeKey: "Author",
      value: personAliasGuid,
      $filter: "Status eq '2' and ContentChannelId eq 43",
      $orderby: "StartDateTime desc",
      $top: "6",
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
  const authorArticles = await fetchAuthorArticles(personAliasGuid);

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
      publications: authorArticles.map((article: any) => {
        return {
          title: article.title,
          readTime: Math.round(article.content.split(" ").length / 200),
          publishDate: format(new Date(article?.startDateTime), "d MMM yyyy"),
          coverImage: createImageUrlFromGuid(
            article.attributeValues?.image?.value
          ),
          summary: article.attributeValues?.summary?.value,
          url: article.attributeValues?.url?.value,
        };
      }),
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

  return <LoaderReturnType>authorData;
};
