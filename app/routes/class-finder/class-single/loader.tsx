import { LoaderFunctionArgs } from "react-router-dom";
import { AuthenticationError } from "~/lib/.server/error-types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import type { RockContentChannelItem } from "~/lib/types/rock-types";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  classUrl: string;
  discussionGuideUrl: string;
  classTrailer: string;
};

function rockStringAttr(
  item: RockContentChannelItem | null | undefined,
  key: string,
): string {
  const v = item?.attributeValues?.[key]?.value;
  return typeof v === "string" ? v.trim() : "";
}

export async function loader({ params }: LoaderFunctionArgs) {
  const url = params.path || "";

  if (!url) {
    throw new Error("Class not found");
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError("Algolia credentials not found");
  }

  let discussionGuideUrl = "";
  let classTrailer = "";

  try {
    const classData = (await fetchRockData({
      endpoint: "DefinedValues/GetByAttributeValue",
      queryParams: {
        attributeKey: "Url",
        value: url,
        loadAttributes: "simple",
        $top: "1",
      },
    })) as RockContentChannelItem | undefined;

    if (classData) {
      discussionGuideUrl = rockStringAttr(classData, "discussionGuide");
      classTrailer = rockStringAttr(classData, "classTrailer");
    }
  } catch (error) {
    console.warn("Failed to load class data from Rock:", error);
  }

  return {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    classUrl: url,
    discussionGuideUrl,
    classTrailer,
  };
}
