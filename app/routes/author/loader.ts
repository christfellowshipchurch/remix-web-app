import { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { fetchAuthorData } from "../articles/article-single/loader";
import { AuthorArticleProps } from "./components/author-content";
import { format } from "date-fns";

type SocialMedia = {
  type: string;
  url: string;
};

export type Author = {
  hostUrl: string;
  fullName: string;
  profilePhoto: string;
  authorAttributes: {
    bio: string;
    jobTitle: string;
    socialLinks: SocialMedia[];
    publications: AuthorArticleProps[];
    pathname: string;
  };
};

export const fetchPersonAliasGuid = async (primaryAliasId: string) => {
  const personAlias: RockPerson[] = await fetchRockData({
    endpoint: "PersonAlias",
    queryParams: {
      $filter: `Id eq ${primaryAliasId}`,
    },
  });

  return personAlias?.guid;
};

export const fetchAuthorArticles = async (personAliasGuid: string) => {
  const articles = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "Author",
      value: personAliasGuid,
      $filter: "Status eq 'Approved' and ContentChannelId eq 43",
      $orderby: "StartDateTime desc",
      $top: "6",
      loadAttributes: "simple",
    },
  });

  return articles;
};

export const getAuthorDetails = async (personId: string) => {
  try {
    const authorData = await fetchAuthorData({
      authorId: personId,
    });

    if (!authorData) {
      throw new Response(`Author data not found`, {
        status: 404,
        statusText: "Not Found",
      });
    }

    // Get the author's GUID
    const personAliasGuid = await fetchPersonAliasGuid(
      authorData?.primaryAliasId
    );

    if (!personAliasGuid) {
      throw new Response(`Person alias GUID not found`, {
        status: 404,
        statusText: "Not Found",
      });
    }

    // Get articles by the author
    const authorArticles = await fetchAuthorArticles(personAliasGuid);

    // Get the author's social links with null checks
    const socialLinks = [
      {
        url: authorData?.attributeValues?.twitter?.value || null,
        type: "twitter",
      } as SocialMedia,
      {
        url: authorData?.attributeValues?.facebook?.value || null,
        type: "facebook",
      } as SocialMedia,
      {
        url: authorData?.attributeValues?.instagram?.value || null,
        type: "instagram",
      } as SocialMedia,
      {
        url: authorData?.attributeValues?.linkedIn?.value || null,
        type: "linkedIn",
      } as SocialMedia,
    ].filter((link) => link.url !== null);

    return {
      fullName: `${authorData.firstName} ${authorData.lastName}`,
      photo: {
        uri: createImageUrlFromGuid(authorData.photo?.guid) || null,
      },
      authorAttributes: {
        bio: authorData?.attributeValues?.authorBio?.value || "",
        authorId: personId,
        jobTitle: authorData?.attributeValues?.jobTitle?.value || "",
        socialLinks,
        publications: authorArticles
          .map((article: ContentItem) => {
            if (!article) return null;

            try {
              return {
                title: article.title || "",
                readTime: Math.max(
                  1,
                  Math.round((article.content?.split(" ") || []).length / 200)
                ),
                publishDate: format(
                  new Date(article?.startDateTime),
                  "d MMM yyyy"
                ),
                coverImage:
                  createImageUrlFromGuid(
                    article.attributeValues?.image?.value
                  ) || null,
                summary: article.attributeValues?.summary?.value || "",
                url: article.attributeValues?.url?.value || "",
              };
            } catch (error) {
              console.error("Error processing article:", error);
              return null;
            }
          })
          .filter(Boolean),
        pathname: authorData?.attributeValues?.pathname?.value || "",
      },
    };
  } catch (error) {
    console.error("Error in getAuthorDetails:", error);
    throw new Response(`Failed to fetch author details`, {
      status: 404,
      statusText: "Not Found",
    });
  }
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

  const authorData: Author = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    fullName: data.fullName,
    profilePhoto: data.photo.uri ?? "",
    authorAttributes: data.authorAttributes,
  };

  return authorData;
};
