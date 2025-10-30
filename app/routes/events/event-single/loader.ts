import type { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { EventSinglePageType } from "./types";
import { RockContentItem } from "~/lib/types/rock-types";
import {
  createImageUrlFromGuid,
  parseRockKeyValueList,
  parseRockValueList,
} from "~/lib/utils";

const fetchEventData = async (eventPath: string) => {
  const rockData = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "Url",
      $filter: "Status eq 'Approved' and ContentChannelId eq 186",
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
  const eventData: RockContentItem | null = await fetchEventData(eventPath);

  if (!eventData) {
    throw new Response("Event not found at: /events/" + eventPath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const pageData: EventSinglePageType = {
    title: eventData.title,
    subtitle: eventData.attributeValues?.summary?.value || "",
    coverImage: createImageUrlFromGuid(
      eventData.attributeValues?.image?.value || ""
    ),
    heroCtas: parseRockKeyValueList(
      eventData.attributeValues?.heroCtas?.value || ""
    ).map((cta) => ({
      title: cta.title,
      url: cta.url,
    })),
    quickPoints: parseRockValueList(
      decodeURIComponent(eventData.attributeValues?.quickInfoPoints?.value) ||
        ""
    ),
    aboutTitle: eventData.attributeValues?.aboutSectionTitle?.value,
    aboutContent: eventData.attributeValues?.aboutSectionSummary?.value,
    keyInfoCards: [] as { title: string; description: string; icon: string }[], //todo fetch Attribute Matrix
    whatToExpect: parseRockKeyValueList(
      eventData.attributeValues?.whatToExpect?.value || ""
    ).map((item) => ({
      title: item.title,
      description: item.url,
    })),
    moreInfo: eventData.attributeValues?.moreInfo?.value,
    optionalBlurb: parseRockKeyValueList(
      decodeURIComponent(eventData.attributeValues?.optionalBlurb?.value) || ""
    ).map((item) => ({
      title: item.title,
      description: item.url,
    })),
    faqItems: parseRockKeyValueList(
      eventData.attributeValues?.faqItems?.value || ""
    ).map((item) => ({
      question: item.title,
      answer: item.url,
    })),
  };

  return pageData;
};
