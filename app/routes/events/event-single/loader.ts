import type { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { EventSinglePageType } from "./types";
import { RockContentItem } from "~/lib/types/rock-types";
import {
  createImageUrlFromGuid,
  parseRockKeyValueList,
  parseRockValueList,
} from "~/lib/utils";
import { getAttributeMatrixItems } from "~/lib/.server/rock-utils";

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

  const keyInfoCardsRockItems = await getAttributeMatrixItems({
    attributeMatrixGuid: eventData.attributeValues?.keyInfoCards?.value || "",
  });

  const pageData: EventSinglePageType = {
    title: eventData.title,
    subtitle: eventData.attributeValues?.summary?.value || "",
    coverImage: createImageUrlFromGuid(
      eventData.attributeValues?.image?.value || ""
    ),
    heroCtas: parseRockKeyValueList(
      eventData.attributeValues?.heroCtas?.value || ""
    ).map((cta) => ({
      title: cta.key,
      url: cta.value,
    })),
    quickPoints: parseRockValueList(
      decodeURIComponent(eventData.attributeValues?.quickInfoPoints?.value) ||
        ""
    ),
    aboutTitle: eventData.attributeValues?.aboutSectionTitle?.value,
    aboutContent: eventData.attributeValues?.aboutSectionSummary?.value,
    keyInfoCards: keyInfoCardsRockItems.map((item) => ({
      title: item.attributeValues?.title?.value || "",
      description: item.attributeValues?.description?.value || "",
      icon: item.attributeValues?.icon?.value || "",
    })),
    whatToExpect: parseRockKeyValueList(
      eventData.attributeValues?.whatToExpect?.value || ""
    ).map((item) => ({
      title: item.key,
      description: item.value,
    })),
    moreInfo: eventData.attributeValues?.moreInfo?.value,
    optionalBlurb: parseRockKeyValueList(
      decodeURIComponent(eventData.attributeValues?.optionalBlurb?.value) || ""
    ).map((item) => ({
      title: item.key,
      description: item.value,
    })),
    faqItems: parseRockKeyValueList(
      eventData.attributeValues?.faqs?.value || ""
    ).map((item) => ({
      question: item.key,
      answer: item.value,
    })),
    // enter test data for session schedule cards
    sessionScheduleCards: [
      {
        icon: "currentLocation",
        title: "Palm Beach Gardens",
        description: "1000 Jupiter Park Dr, Jupiter, FL 33458",
        date: "Thursday, September 11th",
        programTime: "10AM",
        partyTime: "11AM",
        additionalInfo: "something else",
        url: "https://www.google.com",
      },
      {
        icon: "globe",
        title: "Online Experience",
        description: "Join us from anywhere",
        date: "Thursday, September 11th",
        programTime: "10AM",
        partyTime: "11AM",
        url: "https://www.google.com",
      },
      {
        icon: "globe",
        title: "Online Experience",
        description: "Join us from anywhere",
        date: "Thursday, September 11th",
        programTime: "10AM",
        partyTime: "11AM",
        url: "https://www.google.com",
      },
      {
        icon: "globe",
        title: "Online Experience",
        description: "Join us from anywhere",
        date: "Thursday, September 11th",
        programTime: "10AM",
        partyTime: "11AM",
        url: "https://www.google.com",
      },
      {
        icon: "globe",
        title: "Online Experience",
        description: "Join us from anywhere",
        date: "Thursday, September 11th",
        programTime: "10AM",
        partyTime: "11AM",
        url: "https://www.google.com",
      },
    ],
  };

  return pageData;
};
