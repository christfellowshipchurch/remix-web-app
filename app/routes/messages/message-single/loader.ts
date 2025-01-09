import type { LoaderFunction } from "react-router";
import { fetchRockData, getImages } from "~/lib/.server/fetchRockData";
import { format } from "date-fns";
import { mockInThisSeries } from "./components/mockData";

export type Message = {
  hostUrl: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  startDateTime: string;
  expireDateTime?: string;
  video?: string;
  wistiaId?: string;
  attributeValues: {
    summary: { value: string };
    author: { value: string; valueFormatted: string };
    url: { value: string };
    // TODO: Figure out the following
    actions: { value: string };
    topic: { value: string }; // TODO: Single tag for related messages on a topic?
    resources: { value: string }; // TODO: Will be an array of resources {title: string, href: string}
    series: { value: string }; // TODO: Id that gives an array of messages?
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
  const rockData = await fetchRockData(
    "ContentChannelItems/GetByAttributeValue",
    {
      attributeKey: "Url",
      $filter: "Status eq '2' and ContentChannelId eq 63",
      value: path,
      loadAttributes: "simple",
    }
  );

  if (rockData.length > 1) {
    console.error(
      `More than one article was found with the same path: /messages/${path}`
    );
    return rockData[0];
  }

  return rockData;
};

export const loader: LoaderFunction = async ({ params }) => {
  const path = params?.path || "";
  const messageData = await fetchMessageData(path);

  if (!messageData) {
    throw new Response("Article not found at: /articles/" + path, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { title, content, startDateTime, attributeValues, attributes } =
    messageData;

  const coverImage = getImages({ attributeValues, attributes });

  // TODO: Get Related Messages
  const relatedMessages: RelatedMessages = {
    messages: mockInThisSeries,
    tagId: "todo",
  };

  const message: Message = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    content,
    summary: attributeValues.summary.value,
    video: attributeValues.videoLink.value,
    wistiaId: attributeValues.media.value,
    coverImage: (coverImage && coverImage[0]) || "",
    startDateTime: format(new Date(startDateTime), "MMMM dd, yyyy"),
    attributeValues,
  };

  return { message, relatedMessages };
};
