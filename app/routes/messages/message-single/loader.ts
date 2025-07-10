import type { LoaderFunction } from "react-router-dom";
import { fetchRockData, getImages } from "~/lib/.server/fetch-rock-data";
import { format } from "date-fns";
import { mockInThisSeries } from "./components/mockData";
import { createImageUrlFromGuid } from "~/lib/utils";

export type Message = {
  hostUrl: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  coverImage: string;
  startDateTime: string;
  expireDateTime?: string;
  video?: string;
  wistiaId?: string;
  attributeValues: {
    summary: { value: string };
    author: { value: string; valueFormatted: string };
    image: { value: string };
    url: { value: string };
    messageSeries: { value: string; valueFormatted: string };
    // TODO: Figure out the following
    actions: { value: string };
    topic: { value: string }; // TODO: Single tag for related messages on a topic?
    resources: { value: string }; // TODO: Will be an array of resources {title: string, href: string}
  };
};

export type RelatedMessages = {
  messages: Message[];
  tagId: string;
};

export type MessageReturnType = {
  message: Message;
  relatedMessages: RelatedMessages;
};

const fetchMessageData = async (path: string) => {
  const rockData = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "Url",
      $filter: "Status eq 'Approved' and ContentChannelId eq 63",
      value: path,
      loadAttributes: "simple",
    },
  });

  if (rockData.length > 1) {
    console.error(
      `More than one article was found with the same path: /messages/${path}`
    );
    return rockData[0];
  }

  return rockData;
};

/**
 * This is a helper function to get the wistiaId from the MediaElements table from the new Rock Update
 * @param {string} guid - The GUID of the media element to look up
 * @returns {Promise<string|null>} The source key (wistiaId) if found, null otherwise
 */
async function getWistiaId(guid: string) {
  try {
    const getMediaElement = await fetchRockData({
      endpoint: "MediaElements",
      queryParams: {
        $filter: `Guid eq guid'${guid}'`,
        $select: "SourceKey",
      },
    });

    if (!getMediaElement) {
      console.warn(`No media element found for GUID: ${guid}`);
      return null;
    }

    return getMediaElement?.sourceKey || null;
  } catch (error) {
    console.error(`Error fetching wistiaId for GUID ${guid}:`, error);
    return null;
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const path = params?.path || "";
  const messageData = await fetchMessageData(path);

  if (!messageData) {
    throw new Response("Sermon not found at: /messages/" + path, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { title, image, content, startDateTime, attributeValues, attributes } =
    messageData;

  const coverImage = getImages({ attributeValues, attributes });
  const imageUrl = createImageUrlFromGuid(image);

  // TODO: Get Related Messages
  const relatedMessages: RelatedMessages = {
    messages: mockInThisSeries,
    tagId: "todo",
  };

  const wistiaId = await getWistiaId(attributeValues.media.value);

  const message: Message = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    content,
    summary: attributeValues.summary.value,
    image: imageUrl,
    video: attributeValues.videoLink.value,
    wistiaId,
    coverImage: (coverImage && coverImage[0]) || "",
    startDateTime: format(new Date(startDateTime), "MMMM dd, yyyy"),
    attributeValues,
  };

  return { message, relatedMessages };
};
