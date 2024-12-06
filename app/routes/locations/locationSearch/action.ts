import { ActionFunction, json } from "@remix-run/node";
import { fetchRockData, postRockData } from "~/lib/.server/fetchRockData";
import { Campus } from "./partials/locations-list.partial";
import { createImageUrlFromGuid, latLonDistance } from "~/lib/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const longitude = parseFloat(formData.longitude as string);
  const latitude = parseFloat(formData.latitude as string);

  const campuses = await fetchRockData("Campuses", {
    $filter: `IsActive eq true`,
    $expand: "Location",
    loadAttributes: "simple",
  });

  campuses.forEach((campus: any) => {
    if (campus && campus.attributeValues.campusImage.value) {
      campus.image = createImageUrlFromGuid(
        campus.attributeValues.campusImage.value
      );
    }
  });

  return json(await getByLocation({ latitude, longitude, campuses }));
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
  const onlineCampus = campuses.filter(({ name }: Campus) =>
    name.includes("Online")
  );
  campuses = campuses.filter(({ name }: Campus) => !name.includes("Online"));

  campuses = campuses.map((campus: any) => ({
    ...campus,
    distanceFromLocation: latLonDistance(
      latitude,
      longitude,
      campus.location.latitude,
      campus.location.longitude
    ),
  }));

  campuses = campuses.sort(
    (a: Campus, b: Campus) =>
      (a.distanceFromLocation ?? 0) - (b.distanceFromLocation ?? 0)
  );

  campuses = [...onlineCampus, ...campuses];

  return campuses as Campus[];
};
