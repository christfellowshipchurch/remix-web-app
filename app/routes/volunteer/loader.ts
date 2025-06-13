import { LoaderFunctionArgs } from "react-router";
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
  missionTrips: Trip[];
  mockCommunityData: CommunityCard[];
  mockRegionData: RegionCard[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const fetchMissions = await fetchMissionTrips();

  const missionTrips: Trip[] = fetchMissions.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.content,
    coverImage: createImageUrlFromGuid(item.attributeValues?.coverImage.value),
    missionTripUrl: item.attributeValues?.url.value,
    coordinates: {
      lat: Number(item.attributeValues?.latitude.value) || 0,
      lng: Number(item.attributeValues?.longitude.value) || 0,
    },
  }));

  return Response.json({
    missionTrips,
    mockCommunityData,
    mockRegionData,
  } as LoaderReturnType);
}
