import { LoaderFunction } from "react-router";
import { AuthenticationError } from "~/lib/.server/error-types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  currentSeries: {
    currentSeriesTitle: string | undefined;
    latestMessage: {
      title: string;
      description: string;
      coverImage: string;
      path: string;
      authorName: string;
      summary: string;
      messageSeries: string;
    };
  };
};

const fetchLatestMessage = async () => {
  const latestMessage = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: "ContentChannelId eq 63",
      $orderby: "StartDateTime desc",
      $top: "1",
      loadAttributes: "simple",
    },
  });

  if (!latestMessage) {
    throw new Error("Latest message not found");
  }

  return {
    currentSeriesTitle:
      latestMessage.attributeValues?.summary?.valueFormatted.split(" | ")[0] ||
      "",
    latestMessage: {
      title: latestMessage.title || "",
      description: latestMessage?.content || "",
      coverImage: latestMessage.attributeValues?.image?.value
        ? createImageUrlFromGuid(latestMessage.attributeValues.image.value)
        : "",
      path: latestMessage.attributeValues?.url?.value || "",
      authorName:
        `Pastor ${latestMessage.attributeValues?.author?.valueFormatted}` || "",
      summary: latestMessage.attributeValues?.summary?.valueFormatted || "",
      messageSeries:
        latestMessage.attributeValues?.messageSeries?.valueFormatted || "",
    },
  };
};

export const loader: LoaderFunction = async () => {
  const currentSeries = await fetchLatestMessage();

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError("Algolia credentials not found");
  }

  return {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    currentSeries,
  };
};
