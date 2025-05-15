import { LoaderFunction } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid, parseRockKeyValueList } from "~/lib/utils";
import {
  getContentType,
  getPathname,
  getSectionType,
  isCollectionType,
} from "./components/builder-utils";
import {
  CollectionItem,
  PageBuilderSection,
  PageBuilderLoader,
  SectionType,
} from "./types";
import { format, parseISO } from "date-fns";

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
  children: any[]
): Promise<PageBuilderSection[]> => {
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

      // Create the base child - represents a section in the page builder
      const baseChild: PageBuilderSection = {
        id: child.id,
        type: sectionType,
        name: child.title,
        content: child.content,
        attributeValues: Object.fromEntries(
          Object.entries(child.attributeValues || {}).map(([key, obj]: any) => [
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
          collection: collection.map((item: any): CollectionItem => {
            const contentType = getContentType(item.contentChannelId);
            const attributeValues = Object.fromEntries(
              Object.entries(item.attributeValues || {}).map(
                ([key, obj]: any) => [key, obj.value]
              )
            );

            if (!contentType) {
              throw new Error(
                `Invalid content type for content channel ID: ${item.contentChannelId}`
              );
            }

            // Generate the summary for the item
            const summary = attributeValues?.summary || "";
            if (!summary) {
              attributeValues.summary = item.content;
            }

            // Generate the pathname for the item
            let pathname = "";
            switch (contentType) {
              case "REDIRECT_CARD":
                pathname = attributeValues?.redirectUrl || "";
                break;
              case "EVENT":
                pathname = getPathname(contentType, attributeValues?.url);
                break;
              default:
                pathname = getPathname(contentType, attributeValues?.pathname);
            }

            // Generate the start date for the item
            let startDate = "";
            if (contentType !== "REDIRECT_CARD") {
              const startDateTime = item.startDateTime || "";
              if (startDateTime) {
                startDate = format(parseISO(startDateTime), "EEE dd MMM yyyy");
              }
            }

            return {
              id: item.id,
              contentChannelId: item.contentChannelId,
              contentType: contentType,
              name: item.title,
              summary,
              image: createImageUrlFromGuid(attributeValues?.image) || "",
              startDate,
              pathname,
              // attributeValues,
            };
          }),
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
      sections: mappedChildren,
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
