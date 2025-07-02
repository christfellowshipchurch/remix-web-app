import { ActionFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { RawCampus, Campus } from "./partials/location-card-list.partial";
import { createImageUrlFromGuid, latLonDistance } from "~/lib/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const longitude = parseFloat(formData.longitude as string);
  const latitude = parseFloat(formData.latitude as string);

  const campuses = (await fetchRockData({
    endpoint: "Campuses",
    queryParams: {
      $filter: "IsActive eq true",
      $expand: "Location",
      loadAttributes: "simple",
    },
  })) as RawCampus[];

  campuses.forEach((campus: RawCampus) => {
    if (campus && campus.attributeValues?.campusImage?.value) {
      campus.image = createImageUrlFromGuid(
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
  campuses: RawCampus[];
}) => {
  const onlineCampus = campuses.filter(({ name }: RawCampus) =>
    name.includes("Online")
  );
  let filteredCampuses = campuses.filter(
    ({ name }: RawCampus) => !name.includes("Online")
  );

  filteredCampuses = filteredCampuses.map((campus: RawCampus) => ({
    ...campus,
    distanceFromLocation: latLonDistance(
      latitude,
      longitude,
      campus.location.latitude,
      campus.location.longitude
    ),
  }));

  filteredCampuses = filteredCampuses.sort(
    (a: RawCampus, b: RawCampus) =>
      (Number(a.distanceFromLocation) || 0) -
      (Number(b.distanceFromLocation) || 0)
  );

  const allCampuses = [...onlineCampus, ...filteredCampuses];

  // Map to minimal Campus type for return
  return allCampuses.map((campus) => ({
    name: campus.name,
    image: campus.image,
    distanceFromLocation: campus.distanceFromLocation,
  })) as Campus[];
};
