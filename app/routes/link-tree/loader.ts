import { LoaderFunctionArgs } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { parseRockKeyValueList } from "~/lib/utils";
import { LinkTreeLoaderData, RockLinkTreeData } from "./types";

import {
  fetchChildItems,
  mapPageBuilderChildItems,
} from "../page-builder/loader";
import { PageBuilderSection } from "../page-builder/types";

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

  if (!linkTreePage || linkTreePage.length === 0) {
    throw new Response("Link tree page not found at: /link-tree/" + pathname, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return linkTreePage;
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

  const children = await fetchChildItems(id);
  const collections = await mapPageBuilderChildItems(children);
  // Ensure we only return resource collections
  const resourceCollections = collections.filter(
    (collection) => collection.type === "RESOURCE_COLLECTION"
  ) as Array<PageBuilderSection & { type: "RESOURCE_COLLECTION" }>;

  return {
    id,
    title,
    content,
    summary,
    additionalResources,
    primaryCallToAction,
    resourceCollections,
  };
};
