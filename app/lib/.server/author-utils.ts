import { fetchRockData } from "./fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

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

export const fetchAuthorByPathname = async (pathname: string) => {
  return fetchRockData({
    endpoint: "People/GetByAttributeValue",
    queryParams: {
      attributeKey: "Pathname",
      value: pathname,
      $expand: "Photo",
      loadAttributes: "simple",
    },
  });
};

export const fetchPersonAliasGuid = async (primaryAliasId: string) => {
  const personAlias: any = await fetchRockData({
    endpoint: "PersonAlias",
    queryParams: {
      $filter: `Id eq ${primaryAliasId}`,
    },
  });

  return personAlias?.guid;
};

export const fetchAuthorId = async (authorId: string) => {
  return fetchRockData({
    endpoint: "PersonAlias",
    queryParams: {
      $filter: `Guid eq guid'${authorId}'`,
      $select: "PersonId",
    },
  });
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

export const getBasicAuthorInfo = async (
  authorId: string,
  pathname: string
) => {
  const { personId } = await fetchAuthorId(authorId);
  const authorData = await fetchAuthorData({ authorId: personId });

  return {
    fullName:
      authorData.fullName || `${authorData.firstName} ${authorData.lastName}`,
    photo: {
      uri: createImageUrlFromGuid(authorData.photo?.guid),
    },
    authorAttributes: {
      authorId,
      pathname,
    },
  };
};

export const getBasicAuthorInfoByPathname = async (pathname: string) => {
  const authorData = await fetchAuthorByPathname(pathname);

  return {
    fullName:
      authorData.fullName || `${authorData.firstName} ${authorData.lastName}`,
    photo: {
      uri: createImageUrlFromGuid(authorData.photo?.guid),
    },
    authorAttributes: {
      authorId: authorData.id,
      pathname: pathname,
    },
  };
};

// Utility function to check if a string is a GUID
const isGuid = (str: string): boolean => {
  const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(str);
};

// Hybrid function that can handle both GUID and pathname
export const getBasicAuthorInfoFlexible = async (authorValue: string) => {
  // Check if the value is a GUID
  if (isGuid(authorValue)) {
    // If it's a GUID, fetch the author data to get the pathname
    const { personId } = await fetchAuthorId(authorValue);
    const authorData = await fetchAuthorData({ authorId: personId });
    const pathname = authorData?.attributeValues?.pathname?.value || "";
    return await getBasicAuthorInfo(authorValue, pathname);
  } else {
    // If it's a pathname, use the new method
    return await getBasicAuthorInfoByPathname(authorValue);
  }
};
