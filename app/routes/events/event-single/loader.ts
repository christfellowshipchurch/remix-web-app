import type { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { EventSinglePageType } from "./types";

const mockEventData: EventSinglePageType = {
  title: "Test Event",
  subtitle: "Test Event Subtitle",
  coverImage:
    "https://cloudfront.christfellowship.church/GetImage.ashx?guid=71b6f4cf-356d-4cdb-a91a-ace4abd6630b",
  heroCtas: [{ title: "Test CTA", href: "#test-cta" }],
  quickPoints: ["Test Quick Point", "Test Quick Point"],
  aboutTitle: "Test About Title",
  aboutContent: "Test About Content",
  keyInfoCards: [
    {
      title: "Test Key Info Card",
      description: "Test Key Info Card Description",
      icon: "star",
    },
    {
      title: "Test Key Info Card",
      description: "Test Key Info Card Description",
      icon: "star",
    },
  ],
  whatToExpect: [
    {
      title: "Test What to Expect",
      description: "Test What to Expect Description",
    },
    {
      title: "Test What to Expect",
      description: "Test What to Expect Description",
    },
  ],
  moreInfo: "Test More Info",
  additionalBlurb: [
    {
      title: "Optional Extra Blurb?",
      description:
        "You can use this blurb for special audiences, such as: Those new to faith who might have an additional call to action. Certain events, unique features like childcare, guest speakers, or accessibility details",
    },
  ],
  faqItems: [
    { question: "Test FAQ Question", answer: "Test FAQ Answer" },
    { question: "Test FAQ Question", answer: "Test FAQ Answer" },
  ],
};

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

  const eventData = await fetchEventData(eventPath);

  if (!eventData) {
    throw new Response("Event not found at: /events/" + eventPath, {
      status: 404,
      statusText: "Not Found",
    });
  }

  // const { title, content, startDateTime, attributeValues, attributes } =
  //   eventData;

  // const coverImage = getImages({ attributeValues, attributes });
  // const { summary, coverImage } = attributeValues ?? {};

  // Using mock data for now, will update with actual data once implemented
  const pageData: EventSinglePageType = mockEventData;

  return pageData;
};
