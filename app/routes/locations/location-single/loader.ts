import { data, LoaderFunction } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { fetchWistiaDataFromRock } from "~/lib/.server/fetch-wistia-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import {
  getSectionType,
  isGuid,
} from "~/routes/page-builder/components/builder-utils";
import { fetchDefinedValue } from "~/routes/page-builder/loader";

import { PageBuilderSection, SectionType } from "~/routes/page-builder/types";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  campusName: string;
  url?: string;
  familiesMappedChildren: PageBuilderSection[];
};

// const upcomingEventsContentIds = [19073, 19074, 19075, 19076, 19077, 19078];
const familiesContentIds = [19038, 19072, 19047, 19048, 19046, 19071];

// TODO: Move all this to Algolia?
const fetchChildren = async ({
  contentIds,
}: {
  contentIds: number[];
}): Promise<any[]> => {
  let children;
  try {
    children = await Promise.all(
      contentIds.map(async (contentId: number) => {
        const child = await fetchRockData({
          endpoint: `ContentChannelItems`,
          queryParams: {
            $filter: `Id eq ${contentId}`,
            loadAttributes: "simple",
          },
        });
        const attributeValues = Object.fromEntries(
          Object.entries(child.attributeValues || {}).map(([key, obj]: any) => [
            key,
            obj.value,
          ])
        );
        const sectionType = getSectionType(
          child.contentChannelId
        ) as SectionType;
        child.type = sectionType;

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
            ...child,
            ...processedValues,
            coverImage: createImageUrlFromGuid(attributeValues?.coverImage),
            featureVideo: fetchVideo,
            name: child.name || child.title,
          };
        }

        return child;
      })
    );
  } catch (error) {
    console.error("Error fetching children:", error);
    children = [];
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

export const loader: LoaderFunction = async ({ params }) => {
  const campusUrl = params.location;

  if (!campusUrl) {
    throw new Response("Campus not found", {
      status: 404,
    });
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!appId || !searchApiKey || !googleMapsApiKey) {
    throw new Response("Keys not found", {
      status: 404,
    });
  }

  const familiesChildren = await fetchChildren({
    contentIds: familiesContentIds,
  });

  // Also look throught the all Children and if the id of the child is 19046, replace it's title with "For Students"
  const familiesChildrenArray = familiesChildren.map((child) => {
    if (child.id === 19046) {
      child.name = "For Students";
    }
    return child;
  });

  const pageData: LoaderReturnType = {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    GOOGLE_MAPS_API_KEY: googleMapsApiKey,
    campusName: decodeURIComponent(campusUrl),
    familiesMappedChildren: familiesChildrenArray,
  };

  return pageData;
};
