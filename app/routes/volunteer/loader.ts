import { LoaderFunctionArgs } from "react-router-dom";
import { CommunityCard, RegionCard, Trip } from "./types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { mockCommunityData, mockRegionData } from "./mock-data";
import { getCoordinatesForCountry } from "./country-coordinates";
import { ContentChannelIds } from "~/lib/rock-config";

const MISSION_TRIPS_CONTENT_CHANNEL_ID = ContentChannelIds.missionTrips;

const fetchMissionTrips = async () => {
  const missionTrips = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: `ContentChannelId eq ${MISSION_TRIPS_CONTENT_CHANNEL_ID}`,
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
        image?: { value: string };
        tripDate?: { value: string };
        missionsUrl?: { value: string };
        country?: { value: string };
      };
    }) => {
      const country = item.attributeValues?.country?.value || "";
      const resolvedCoordinates = getCoordinatesForCountry(country);
      return {
        id: Number(item.id) || 0,
        title: item.title,
        description: item.content,
        image: item.attributeValues?.image?.value
          ? createImageUrlFromGuid(item.attributeValues.image.value)
          : "",
        country,
        tripDate: item.attributeValues?.tripDate?.value || "",
        missionsUrl: item.attributeValues?.missionsUrl?.value || "",
        coordinates: resolvedCoordinates ?? undefined,
      };
    },
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
