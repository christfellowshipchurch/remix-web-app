import { LoaderFunctionArgs } from "react-router-dom";
import { CommunityCard, RegionCard, Trip } from "./types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { mockCommunityData, mockRegionData } from "./mock-data";

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

export type LoaderReturnType = {
  missionTrips: Record<string, Trip[]>;
  mockCommunityData: CommunityCard[];
  mockRegionData: RegionCard[];
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
    }),
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
    {} as Record<string, Trip[]>,
  );

  return Response.json({
    missionTrips: groupedTrips,
    mockCommunityData,
    mockRegionData,
  } as LoaderReturnType);
}
