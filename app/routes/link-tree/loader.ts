import { LoaderFunctionArgs } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { parseRockKeyValueList } from "~/lib/utils";
import { LinkTreeLoaderData, RockLinkTreeData } from "./types";

const fetchLinkTreePage = async (pathname: string) => {
  const linkTreePage = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "Pathname",
      $filter: "ContentChannelId eq 166 and Status eq 'Approved'",
      value: pathname,
      loadAttributes: "simple",
    },
  });

  return linkTreePage;
};

const fetchCardCollections = async (id: string) => {
  const collections = await fetchRockData({
    endpoint: `ContentChannelItems/GetChildren/${id}`,
  });

  if (!collections || !Array.isArray(collections) || collections.length === 0) {
    console.log("No valid collections data found");
    return [];
  }

  const cardCollections = await Promise.all(
    collections.map(async (collection: any) => {
      const items = await fetchRockData({
        endpoint: `ContentChannelItems/GetChildren/${collection.Id}`,
        cache: false,
      });

      return {
        title: collection.Title || collection.title || "Untitled",
        collectionType: collection.ContentChannelType?.Name || "Unknown",
        items:
          items?.map((item: any) => ({
            title: item.Title || item.title || "Untitled",
            url: item.attributeValues?.url?.value || "",
            description: item.attributeValues?.description?.value,
            imageUrl: item.attributeValues?.image?.value,
          })) || [],
      };
    })
  );

  return cardCollections;
};

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<LinkTreeLoaderData | []> => {
  const pathname = request.url.split("/").pop();
  if (!pathname) {
    return [];
  }

  const linkTreePage = await fetchLinkTreePage(pathname);

  if (!linkTreePage) {
    return [];
  }

  const {
    id,
    title,
    content,
    attributeValues: {
      summary: { value: summary },
      additionalResources: { value: additionalResourcesKeyValues },
      calltoAction: { value: calltoActionKeyValues },
    },
  } = linkTreePage as RockLinkTreeData;

  const additionalResources = parseRockKeyValueList(
    additionalResourcesKeyValues
  );

  const primaryCallToAction = parseRockKeyValueList(calltoActionKeyValues)[0]; // only returning the first call to action

  // todo: Fix card collections for link tree(getChildren not working)
  // const cardCollections = await fetchCardCollections(id);

  return {
    id,
    title,
    content,
    summary,
    additionalResources,
    primaryCallToAction,
    cardCollections: [],
  };
};
