import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { fetchWistiaData } from "~/lib/.server/fetch-wistia-data";
import { RawCampus, Campus } from "./partials/location-card-list.partial";

export type CampusesReturnType = {
  campuses: Campus[];
  bgVideo: string;
};

export async function loader() {
  const campuses: RawCampus[] = await fetchRockData({
    endpoint: "Campuses",
    queryParams: {
      $filter: "IsActive eq true",
      $expand: "Location",
      $orderby: "Order",
      loadAttributes: "simple",
    },
  });

  campuses.forEach((campus: RawCampus) => {
    if (campus && campus.attributeValues?.campusImage?.value) {
      campus.image = createImageUrlFromGuid(
        campus.attributeValues.campusImage.value
      );
    }
  });

  const bgVideo = await fetchWistiaData({ id: "padj4c4xoh", size: 960 });

  // Map to minimal Campus type for return
  const mappedCampuses = campuses.map((campus) => ({
    name: campus.name,
    image: campus.image,
    distanceFromLocation: campus.distanceFromLocation,
  })) as Campus[];

  return { bgVideo, campuses: mappedCampuses };
}
