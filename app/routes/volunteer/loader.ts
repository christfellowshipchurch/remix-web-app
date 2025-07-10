import { LoaderFunctionArgs } from "react-router-dom";
import {
  CommunityCard,
  RegionCard,
  Trip,
  VolunteerFeaturedEvent,
} from "./types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import {
  mockCommunityData,
  mockRegionData,
  mockVolunteerFeaturedEvent,
} from "./mock-data";

const fetchMissionTrips = async () => {
  const missionTrips = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: "ContentChannelId eq 174",
      loadAttributes: "simple",
    },
    cache: false,
  });

  // ensure contentItems is an array
  const trips = Array.isArray(missionTrips) ? missionTrips : [missionTrips];

  return trips;
};

export type LoaderReturnType = {
  missionTrips: Record<string, Trip[]>;
  mockCommunityData: CommunityCard[];
  mockRegionData: RegionCard[];
  mockVolunteerFeaturedEvent: VolunteerFeaturedEvent;
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
    mockVolunteerFeaturedEvent,
  } as LoaderReturnType);
}
