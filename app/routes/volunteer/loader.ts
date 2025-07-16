import { LoaderFunctionArgs } from "react-router-dom";
import { CommunityCard, RegionCard, Trip } from "./types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { mockCommunityData, mockRegionData } from "./mock-data";
import { Event } from "../events/all-events/loader";
import { formatDate } from "date-fns";

const fetchMissionTrips = async () => {
  const missionTrips = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: "ContentChannelId eq 174",
      loadAttributes: "simple",
    },
  });

  // ensure contentItems is an array
  const trips = Array.isArray(missionTrips) ? missionTrips : [missionTrips];

  return trips;
};
const fetchFeaturedEvent = async (): Promise<Event> => {
  // TODO: We'll need to create some sort of tag/filter to specify the event we want to show. For now, we'll just show the latest event.
  const featuredEvents = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: `ContentChannelId eq 78 and Status eq 'Approved'`,
      $orderby: "ExpireDateTime desc",
      $top: "1",
      loadAttributes: "simple",
    },
  });

  // Ensure we have an array and get the first event
  const events = Array.isArray(featuredEvents)
    ? featuredEvents
    : [featuredEvents];
  const featuredEvent = events[0];

  if (!featuredEvent) {
    throw new Error("No featured event found");
  }

  // Transform to match Event type from events loader
  const event: Event = {
    id: featuredEvent.id,
    title: featuredEvent.title,
    content: featuredEvent.content,
    date: "", // Will be calculated below
    expireDateTime: featuredEvent.expireDateTime,
    startDate: "", // Will be calculated below
    startDateTime: featuredEvent.startDateTime,
    image: createImageUrlFromGuid(
      featuredEvent.attributeValues?.image?.value || ""
    ),
    attributeValues: {
      campus: featuredEvent.attributeValues?.campus
        ? {
            value: featuredEvent.attributeValues.campus.value,
          }
        : undefined,
      summary: {
        value: featuredEvent.attributeValues?.summary?.value || "",
      },
      image: {
        value: createImageUrlFromGuid(
          featuredEvent.attributeValues?.image?.value || ""
        ),
      },
      url: {
        value: featuredEvent.attributeValues?.url?.value || "",
      },
    },
  };

  // Calculate formatted dates like in the events loader
  if (event.startDateTime) {
    event.startDate = formatDate(new Date(event.startDateTime), "MMMM d, yyyy");
  }

  if (event.expireDateTime) {
    // To find the date of the event, we need to subtract 1 day from the expired dateTime
    const expireDate = new Date(event.expireDateTime);
    expireDate.setDate(expireDate.getDate() - 1);
    event.date = formatDate(expireDate, "MMMM d, yyyy");
  }

  return event;
};

export type LoaderReturnType = {
  missionTrips: Record<string, Trip[]>;
  mockCommunityData: CommunityCard[];
  mockRegionData: RegionCard[];
  featuredEvent: Event;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const fetchMissions = await fetchMissionTrips();

  const missionTrips: Trip[] = fetchMissions.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.content,
    coverImage: createImageUrlFromGuid(item.attributeValues?.coverImage.value),
    applyUrl: item.attributeValues?.applyUrl.value,
    donateUrl: item.attributeValues?.donateUrl.value,
    groupType: item.attributeValues?.groupType.value,
    city: item.attributeValues?.city.value,
    country: item.attributeValues?.country.value,
    dateOfTrip: item.attributeValues?.dateOfTrip.value,
    cost: item.attributeValues?.cost.value,
    coordinates: {
      lat: Number(item.attributeValues?.latitude.value) || 0,
      lng: Number(item.attributeValues?.longitude.value) || 0,
    },
  }));

  // Group trips by country
  const groupedTrips = missionTrips.reduce(
    (acc: Record<string, Trip[]>, trip: Trip) => {
      const country = trip.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(trip);
      return acc;
    },
    {} as Record<string, Trip[]>
  );

  return Response.json({
    missionTrips: groupedTrips,
    mockCommunityData,
    mockRegionData,
    featuredEvent: await fetchFeaturedEvent(),
  } as LoaderReturnType);
}
