import { formatDate } from "date-fns";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type EventReturnType = {
  featuredEvents: Event[];
  upcomingEvents: Event[];
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
};

export type Event = {
  id: string;
  campus?: string;
  content?: string;
  title: string;
  date: string; // Formatted date
  expireDateTime: string; // Rock date
  startDate: string; // Formatted date
  startDateTime: string; // Rock date
  image: string;
  attributeValues: {
    campus?: {
      value: string;
    };
    summary: {
      value: string;
    };
    image: {
      value: string;
    };
    url: {
      value: string;
    };
  };
};

const getEvents = async () => {
  const upcomingEvents = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: `ContentChannelId eq 78 and Status eq 'Approved'`,
      $orderby: "ExpireDateTime desc",
      $top: "22",
      loadAttributes: "simple",
    },
  });

  upcomingEvents.forEach((event: Event) => {
    if (event && event.attributeValues.campus?.value) {
      // TODO: Get campus name from campus guid?? once added to the attribute values in Rock
      event.campus = event.attributeValues.campus.value;
    }
  });

  upcomingEvents.forEach((event: Event) => {
    if (event && event.attributeValues.image.value) {
      event.image = createImageUrlFromGuid(event.attributeValues.image.value);
    }
  });

  upcomingEvents.forEach((event: Event) => {
    event.startDate = formatDate(new Date(event.startDateTime), "MMMM d, yyyy");
  });

  upcomingEvents.forEach((event: Event) => {
    // To find the date of the event, we need to subtract 1 day from the expired dateTime. This may change in the future.
    const expireDate = new Date(event.expireDateTime);
    expireDate.setDate(expireDate.getDate() - 1);
    event.date = formatDate(expireDate, "MMMM d, yyyy");
  });

  return upcomingEvents;
};

export const loader = async () => {
  const allEvents = await getEvents();
  const featuredEvents = allEvents.slice(0, 4);
  const upcomingEvents = allEvents.slice(4);

  return {
    featuredEvents,
    upcomingEvents,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  };
};
