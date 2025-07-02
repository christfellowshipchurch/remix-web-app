import type { LoaderFunction } from "react-router-dom";
import { fetchRockData, getImages } from "~/lib/.server/fetch-rock-data";
import { format } from "date-fns";

// TODO: Figure out how to get the read event date-time
export type LoaderReturnType = {
  hostUrl: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  publishDate: string;
  expireDateTime?: string;
  attributeValues: {
    summary: { value: string };
    whatToExpect: { value: string };
    // TODO: Figure out actions
    actions: { value: string };
  };
};

const fetchEventData = async (eventPath: string) => {
  const rockData = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "Url",
      $filter: "Status eq 'Approved' and ContentChannelId eq 78",
      value: eventPath,
      loadAttributes: "simple",
    },
  });

  if (!rockData || rockData.length === 0) {
    throw new Response("Event not found at: /events/" + eventPath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (rockData.length > 1) {
    console.error(
      `More than one article was found with the same path: /events/${eventPath}`
    );
    return rockData[0];
  }

  return rockData;
};

export const loader: LoaderFunction = async ({ params }) => {
  const eventPath = params?.path || "";

  const eventData = await fetchEventData(eventPath);

  if (!eventData) {
    throw new Response("Event not found at: /events/" + eventPath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { title, content, startDateTime, attributeValues, attributes } =
    eventData;

  const coverImage = getImages({ attributeValues, attributes });
  const { summary } = attributeValues;

  const pageData: LoaderReturnType = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title,
    content,
    summary: summary.value,
    coverImage: coverImage[0],
    publishDate: format(new Date(startDateTime), "d MMM yyyy"),
    attributeValues,
  };

  return pageData;
};
