import type { LoaderFunction } from "react-router-dom";
import { EventSinglePageType } from "./types";
import { RockContentChannelItem } from "~/lib/types/rock-types";
import {
  createImageUrlFromGuid,
  parseRockKeyValueList,
  parseRockValueList,
} from "~/lib/utils";
import { getAttributeMatrixItems } from "~/lib/.server/rock-utils";
import { fetchEventData, mapSessionScheduleCards } from "./utils";

export const loader: LoaderFunction = async ({ params }) => {
  const eventPath = params?.path || "";
  const eventData: RockContentChannelItem | null = await fetchEventData(
    eventPath
  );

  if (!eventData) {
    throw new Response("Event not found at: /events/" + eventPath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const keyInfoCardsRockItems = await getAttributeMatrixItems({
    attributeMatrixGuid: eventData.attributeValues?.keyInfoCards?.value || "",
  });

  const sessionScheduleCardsRockItems = await getAttributeMatrixItems({
    attributeMatrixGuid: eventData.attributeValues?.eventSessions?.value || "",
  });

  const sessionScheduleCards = await mapSessionScheduleCards(
    sessionScheduleCardsRockItems
  );

  const pageData: EventSinglePageType = {
    title: eventData.title,
    titleOverride: eventData.attributeValues?.titleOverride?.value || "",
    subtitle: eventData?.content || "",
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
    moreInfoTitle: eventData.attributeValues?.moreInfoTitle?.value,
    moreInfoText: eventData.attributeValues?.moreInfoText?.value,
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
    sessionScheduleCards,
  };

  return pageData;
};
