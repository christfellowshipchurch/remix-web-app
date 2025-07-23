import { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import {
  createImageUrlFromGuid,
  getIdentifierType,
  parseRockKeyValueList,
} from "~/lib/utils";
import {
  getContentType,
  getPathname,
  getSectionType,
  isCollectionType,
  isGuid,
} from "./components/builder-utils";
import {
  CollectionItem,
  PageBuilderSection,
  PageBuilderLoader,
  SectionType,
} from "./types";
import { format, parseISO } from "date-fns";
import { fetchWistiaDataFromRock } from "~/lib/.server/fetch-wistia-data";

export const fetchChildItems = async (id: string) => {
  const childReferences = await fetchRockData({
    endpoint: `ContentChannelItemAssociations`,
    queryParams: {
      loadAttributes: "simple",
      $filter: `ContentChannelItemId eq ${id}`,
      $orderby: "Order",
    },
  });

  if (!childReferences) {
    console.log("No valid child references found");
    return [];
  }

  //ensure childReferences is an array
  let childReferencesArray = [];
  if (!Array.isArray(childReferences)) {
    childReferencesArray = [childReferences];
  } else {
    childReferencesArray = childReferences;
  }

  const children = await Promise.all(
    childReferencesArray.map(async (childReference: any) => {
      return await fetchRockData({
        endpoint: `ContentChannelItems/${childReference.childContentChannelItemId}`,
        queryParams: {
          loadAttributes: "simple",
        },
      });
    })
  );

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

export const fetchDefinedValue = async (guid: string) => {
  const definedValue = await fetchRockData({
    endpoint: `DefinedValues/`,
    queryParams: {
      $filter: `Guid eq guid'${guid}'`,
    },
  });

  if (!definedValue) {
    throw new Error(`Defined value not found for GUID: ${guid}`);
  }

  // ensure definedValue is an array
  let definedValueArray = [];
  if (!Array.isArray(definedValue)) {
    definedValueArray = [definedValue];
  } else {
    definedValueArray = definedValue;
  }

  if (definedValueArray.length > 0) {
    return definedValueArray[0].value;
  } else {
    return "";
  }
};

const getLinkTreeLayout = async (attributeValues: any) => {
  if (attributeValues?.linkTreeLayout) {
    return await fetchDefinedValue(attributeValues.linkTreeLayout.value);
  }
  return undefined;
};

export const mapPageBuilderChildItems = async (
  children: any[]
): Promise<PageBuilderSection[]> => {
  return Promise.all(
    // Map over the children and define the PageBuilder Section Type
    children.map(async (child) => {
      const typeId = child.contentChannelId;
      const isCollection = isCollectionType(typeId);
      const sectionType = getSectionType(typeId) as SectionType;
      // Map the attribute values to a key-value object for easier access
      const attributeValues = Object.fromEntries(
        Object.entries(child.attributeValues || {}).map(([key, obj]: any) => [
          key,
          obj.value,
        ])
      );

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
        attributeValues: attributeValues,
        linkTreeLayout: await getLinkTreeLayout(child.attributeValues),
      };

      // If the child is a collection, fetch the child items and return them
      if (isCollection) {
        const collection = await fetchChildItems(child.id);
        return {
          ...baseChild,
          collection: collection.map((item: any): CollectionItem => {
            const contentType = getContentType(item.contentChannelId);
            // Map the attribute values to a key-value object for easier access
            const itemAttributeValues = Object.fromEntries(
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
            const summary = itemAttributeValues?.summary || "";
            if (!summary) {
              itemAttributeValues.summary = item.content;
            }

            // Generate the pathname for the item
            let pathname = "";
            switch (contentType) {
              case "REDIRECT_CARD":
                pathname = itemAttributeValues?.redirectUrl || "";
                break;
              case "EVENT":
                pathname = getPathname(contentType, itemAttributeValues?.url);
                break;
              default:
                pathname = getPathname(
                  contentType,
                  itemAttributeValues?.pathname
                );
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
              image: createImageUrlFromGuid(itemAttributeValues?.image) || "",
              startDate,
              pathname,
              // attributeValues,
            };
          }),
        };
      }

      // If the section is a content block, fetch the defined values for any GUIDs that are not the cover image or video
      if (sectionType === "CONTENT_BLOCK") {
        const updatedValues = await Promise.all(
          Object.entries(attributeValues || {}).map(async ([key, value]) => {
            const processedValue =
              typeof value === "string" &&
              isGuid(value) &&
              key !== "coverImage" &&
              key !== "video"
                ? await fetchDefinedValue(value)
                : value;
            return [key, processedValue];
          })
        );

        const processedValues = Object.fromEntries(updatedValues);

        const fetchVideo = attributeValues?.featureVideo
          ? (await fetchWistiaDataFromRock(attributeValues.featureVideo))
              .sourceKey
          : null;

        return {
          ...baseChild,
          ...processedValues,
          coverImage: createImageUrlFromGuid(attributeValues?.coverImage),
          featureVideo: fetchVideo,
        };
      }

      if (sectionType === "FAQs") {
        const { id: matrixId } = await fetchRockData({
          endpoint: `AttributeMatrices`,
          queryParams: {
            $filter: `Guid eq guid'${attributeValues?.faqs}'`,
            $select: "Id",
          },
        });

        const faqs = await fetchRockData({
          endpoint: `AttributeMatrixItems`,
          queryParams: {
            $filter: `AttributeMatrix/${getIdentifierType(matrixId).query}`,
            loadAttributes: "simple",
          },
        });

        return {
          ...baseChild,
          faqs: faqs.map((faq: any) => ({
            id: faq.id,
            question: faq.attributeValues.header.value,
            answer: faq.attributeValues.content.value,
          })),
        };
      }

      if (sectionType === "IMAGE_GALLERY") {
        const { id: matrixId } = await fetchRockData({
          endpoint: `AttributeMatrices`,
          queryParams: {
            $filter: `Guid eq guid'${attributeValues?.images}'`,
            $select: "Id",
          },
        });

        const imageGallery = await fetchRockData({
          endpoint: `AttributeMatrixItems`,
          queryParams: {
            $filter: `AttributeMatrix/${getIdentifierType(matrixId).query}`,
            loadAttributes: "simple",
          },
        });

        return {
          ...baseChild,
          imageGallery: imageGallery.map((image: any) =>
            createImageUrlFromGuid(image.attributeValues.image.value)
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
        $filter: "ContentChannelId eq 176",
      },
    });

    // Handle case where pageData might be an array or null/undefined
    if (!pageData) {
      throw new Response(`Page not found with pathname: ${pathname}`, {
        status: 404,
        statusText: "Not Found",
      });
    }

    // Ensure pageData is a single object, not an array
    const page = Array.isArray(pageData) ? pageData[0] : pageData;

    if (!page || !page.id) {
      throw new Response(`Page not found with pathname: ${pathname}`, {
        status: 404,
        statusText: "Not Found",
      });
    }

    const children = await fetchChildItems(page.id);
    const mappedChildren = await mapPageBuilderChildItems(children);

    const pageBuilder: PageBuilderLoader = {
      title: page.title,
      heroImage:
        createImageUrlFromGuid(page.attributeValues?.heroImage?.value) || "",
      content: page.content,
      callsToAction:
        parseRockKeyValueList(page.attributeValues?.callsToAction?.value) || [],
      sections: mappedChildren,
    };

    return pageBuilder;
  } catch (error) {
    console.error("Error in page builder loader:", error);

    // If it's already a Response, re-throw it
    if (error instanceof Response) {
      throw error;
    }

    throw new Response("Failed to load page content", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
