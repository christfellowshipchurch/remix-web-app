import { formatDate } from "date-fns";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type EventReturnType = {
  featuredEvents: Event[];
  upcomingEvents: Event[];
};

export type Event = {
  campus?: string;
  title: string;
  date: string; // Formatted date
  expireDateTime: string; // Rock date
  startDate: string; // Formatted date
  startDateTime: string; // Rock date
  image: string;
  attributeValues: {
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

const getUpcomingEvents = async () => {
  const upcomingEvents = await fetchRockData("ContentChannelItems", {
    // TODO: Update order by some sort of priority
    $filter: `ContentChannelId eq 78 and Status eq 'Approved'`,
    $orderby: "ExpireDateTime desc",
    $top: "22",
    loadAttributes: "simple",
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
  const allEvents = await getUpcomingEvents();
  const featuredEvents = allEvents.slice(0, 4);
  const upcomingEvents = allEvents.slice(4);

  return { featuredEvents, upcomingEvents };
};
