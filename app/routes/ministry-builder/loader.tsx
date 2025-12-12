import { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid, parseRockKeyValueList } from "~/lib/utils";

import {
  fetchChildItems,
  mapPageBuilderChildItems,
} from "../page-builder/loader";
import { PageBuilderLoader } from "../page-builder/types";
import { RockCampuses } from "~/lib/rock-config";
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
        $filter: "ContentChannelId eq 171", //TODO: this is the ministries page, update this to be dynamic
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
        parseRockKeyValueList(
          pageData.attributeValues?.callsToAction?.value
        )?.map((cta) => ({
          title: cta.key,
          url: cta.value,
        })) || [],
      sections: mappedChildren,
      services: [
        {
          id: "1",
          ministryType: "cf-kids",
          location: RockCampuses[0], //Gardens
          daysOfWeek: "Sunday",
          times: "8AM, 9:30AM, 11AM",
          learnMoreLink: "/kids-university",
        },
        {
          id: "2",
          ministryType: "kids-university",
          location: RockCampuses[0], //Gardens
          daysOfWeek: "Sunday",
          times: "6:30PM",
          learnMoreLink: "/service",
          planYourVisit: true,
        },
      ],
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
