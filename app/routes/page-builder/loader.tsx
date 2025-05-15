import { LoaderFunction } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid, parseRockKeyValueList } from "~/lib/utils";
import {
  getContentType,
  getSectionType,
  isCollectionType,
} from "./components/builder-utils";
import {
  CollectionItem,
  PageBuilderChild,
  PageBuilderLoader,
  RockContentItem,
  SectionType,
} from "./types";

const fetchChildItems = async (id: string) => {
  const children = await fetchRockData({
    endpoint: `ContentChannelItems/GetChildren/${id}`,
    queryParams: {
      loadAttributes: "simple",
    },
    cache: false,
  });

  if (!children || (Array.isArray(children) && children.length === 0)) {
    console.log("No valid children data found");
    return [];
  }

  // Ensure children is an array
  let childrenArray = [];
  if (!Array.isArray(children)) {
    childrenArray = [children];
  } else {
    childrenArray = children;
  }

  return childrenArray;
};

const mapPageBuilderChildItems = async (
  children: RockContentItem[]
): Promise<PageBuilderChild[]> => {
  return Promise.all(
    // Map over the children and define the PageBuilder Section Type
    children.map(async (child) => {
      const typeId = child.contentChannelId;
      const isCollection = isCollectionType(typeId);
      const sectionType = getSectionType(typeId) as SectionType;

      if (!sectionType) {
        throw new Error(
          `Invalid section type for content channel ID: ${typeId}`
        );
      }

      const baseChild: PageBuilderChild = {
        id: child.id,
        type: sectionType,
        name: child.title,
        content: child.content,
        attributeValues: Object.fromEntries(
          Object.entries(child.attributeValues || {}).map(([key, obj]) => [
            key,
            obj.value,
          ])
        ),
      };

      // If the child is a collection, fetch the child items and return them
      if (isCollection) {
        const collection = await fetchChildItems(child.id);
        return {
          ...baseChild,
          collection: collection.map(
            (item: RockContentItem): CollectionItem => {
              const contentType = getContentType(item.contentChannelId);

              if (!contentType) {
                throw new Error(
                  `Invalid content type for content channel ID: ${item.contentChannelId}`
                );
              }

              const summary = item.attributeValues?.summary?.value || "";
              if (!summary) {
                item.attributeValues = {
                  ...item.attributeValues,
                  summary: { value: item.content },
                };
              }

              return {
                id: item.id,
                contentChannelId: item.contentChannelId,
                contentType: contentType,
                name: item.title,
                attributeValues: Object.fromEntries(
                  Object.entries(item.attributeValues || {}).map(
                    ([key, obj]) => [key, obj.value]
                  )
                ),
              };
            }
          ),
        };
      }

      return baseChild;
    })
  );
};

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const pathname = params?.path;

    if (!pathname) {
      throw new Response("Pathname is required", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const pageData = await fetchRockData({
      endpoint: "ContentChannelItems/GetByAttributeValue",
      queryParams: {
        attributeKey: "Pathname",
        value: pathname,
        loadAttributes: "simple",
        $filter: "ContentChannelId eq 171",
      },
    });

    if (!pageData) {
      throw new Response(`Page not found with pathname: ${pathname}`, {
        status: 404,
        statusText: "Not Found",
      });
    }

    const children = await fetchChildItems(pageData.id);
    const mappedChildren = await mapPageBuilderChildItems(children);

    const pageBuilder: PageBuilderLoader = {
      title: pageData.title,
      heroImage:
        createImageUrlFromGuid(pageData.attributeValues?.heroImage?.value) ||
        "",
      content: pageData.content,
      callsToAction:
        parseRockKeyValueList(pageData.attributeValues?.callsToAction?.value) ||
        [],
      children: mappedChildren,
    };

    return pageBuilder;
  } catch (error) {
    console.error("Error in page builder loader:", error);
    throw new Response("Failed to load page content", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
