import { ActionFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { CampusHit as Campus } from "./partials/location-card-list.partial";
import { createImageUrlFromGuid, latLonDistance } from "~/lib/utils";

// TODO: Add proper typing for campuese and remove any

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const longitude = parseFloat(formData.longitude as string);
  const latitude = parseFloat(formData.latitude as string);

  const campuses = await fetchRockData({
    endpoint: "Campuses",
    queryParams: {
      $filter: `IsActive eq true`,
      $expand: "Location",
      loadAttributes: "simple",
    },
  });

  campuses.forEach((campus: any) => {
    if (campus && campus.attributeValues?.campusImage?.value) {
      (campus as any).campusImage = createImageUrlFromGuid(
        campus.attributeValues.campusImage.value
      );
    }
  });

  return await getByLocation({ latitude, longitude, campuses });
};

export const getByLocation = async ({
  latitude,
  longitude,
  campuses,
}: {
  latitude: number;
  longitude: number;
  campuses: Campus[];
}) => {
  const onlineCampus = campuses.filter(
    (campus: any) =>
      campus.name?.includes("Online") || campus.campusName?.includes("Online")
  );
  campuses = campuses.filter(
    (campus: any) =>
      !campus.name?.includes("Online") && !campus.campusName?.includes("Online")
  );

  campuses = campuses.map((campus: any) => {
    const location = campus.location || campus.geoloc;
    if (location && location.latitude && location.longitude) {
      return {
        ...campus,
        distanceFromLocation: latLonDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        ),
      };
    }
    return campus;
  });

  campuses = campuses.sort(
    (a: any, b: any) =>
      (a.distanceFromLocation ?? 0) - (b.distanceFromLocation ?? 0)
  );

  campuses = [...onlineCampus, ...campuses];

  return campuses as Campus[];
};
