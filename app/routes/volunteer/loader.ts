import { LoaderFunctionArgs } from "react-router-dom";
import { RegionCard, Trip } from "./types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { mockRegionData } from "./mock-data";

const fetchVolunteerTrips = async () => {
  const rawTrips = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: "ContentChannelId eq 174",
      loadAttributes: "simple",
    },
  });

  const trips = Array.isArray(rawTrips) ? rawTrips : [rawTrips];

  return trips;
};

export type LoaderReturnType = {
  volunteerTrips: Record<string, Trip[]>;
  mockRegionData: RegionCard[];
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
};

export async function loader({ request: _request }: LoaderFunctionArgs) {
  const fetchedTrips = await fetchVolunteerTrips();

  const volunteerTripsList: Trip[] = fetchedTrips.map(
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

  const groupedTrips = volunteerTripsList.reduce(
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
    volunteerTrips: groupedTrips,
    mockRegionData,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID ?? "",
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY ?? "",
  } satisfies LoaderReturnType);
}
