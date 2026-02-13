import { LoaderFunctionArgs } from "react-router-dom";
import { CommunityCard, RegionCard, Trip } from "./types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { mockCommunityData, mockRegionData } from "./mock-data";
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

type Event = {
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

const fetchFeaturedEvent = async (): Promise<Event | null> => {
  const response = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "ShowOnVolunteerPage",
      value: "True",
      $filter: `ContentChannelId eq 186 and Status eq 'Approved'`,
      $orderby: "StartDateTime desc",
      $top: "1",
      loadAttributes: "simple",
    },
  });

  const rawEvents = Array.isArray(response) ? response : [response];
  const featuredEvent = rawEvents[0];

  if (!featuredEvent) {
    return null;
  }

  const attr = featuredEvent.attributeValues ?? {};
  const eventUrl =
    attr?.featuredVolunteerEventURL?.value?.trim() || attr.url?.value || "";

  // Transform to match Event type from events loader
  const event: Event = {
    id: featuredEvent.id,
    title: featuredEvent.title,
    content: featuredEvent.content,
    date: "", // Will be calculated below
    expireDateTime: featuredEvent.expireDateTime,
    startDate: "", // Will be calculated below
    startDateTime: featuredEvent.startDateTime,
    image: createImageUrlFromGuid(attr.image?.value || ""),
    attributeValues: {
      campus: attr.campus ? { value: attr.campus.value } : undefined,
      summary: { value: attr.summary?.value || "" },
      image: {
        value: createImageUrlFromGuid(attr.image?.value || ""),
      },
      url: { value: eventUrl },
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
  featuredEvent: Event | null;
};

export async function loader({ request: _request }: LoaderFunctionArgs) {
  const fetchMissions = await fetchMissionTrips();

  const missionTrips: Trip[] = fetchMissions.map(
    (item: {
      id: string;
      title: string;
      content: string;
      attributeValues?: {
        coverImage?: { value: string };
        applyUrl?: { value: string };
        donateUrl?: { value: string };
        groupType?: { value: string };
        city?: { value: string };
        country?: { value: string };
        dateOfTrip?: { value: string };
        cost?: { value: string };
        latitude?: { value: string };
        longitude?: { value: string };
      };
    }) => ({
      id: Number(item.id) || 0,
      title: item.title,
      description: item.content,
      coverImage: item.attributeValues?.coverImage?.value
        ? createImageUrlFromGuid(item.attributeValues.coverImage.value)
        : "",
      applyUrl: item.attributeValues?.applyUrl?.value,
      donateUrl: item.attributeValues?.donateUrl?.value || "",
      groupType: item.attributeValues?.groupType?.value || "",
      city: item.attributeValues?.city?.value || "",
      country: item.attributeValues?.country?.value || "",
      dateOfTrip: item.attributeValues?.dateOfTrip?.value || "",
      cost: Number(item.attributeValues?.cost?.value) || 0,
      coordinates: {
        lat: Number(item.attributeValues?.latitude?.value) || 0,
        lng: Number(item.attributeValues?.longitude?.value) || 0,
      },
    })
  );

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
