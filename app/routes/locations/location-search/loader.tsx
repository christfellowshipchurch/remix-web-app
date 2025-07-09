import { LoaderFunctionArgs } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";
import { fetchWistiaData } from "~/lib/.server/fetch-wistia-data";
import { Campus } from "./partials/location-card-list.partial";

export type CampusesReturnType = {
  campuses: Campus[];
  bgVideo: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const campuses: Campus[] = await fetchRockData({
    endpoint: "Campuses",
    queryParams: {
      $filter: `IsActive eq true`,
      $expand: "Location",
      $orderby: "Order",
      loadAttributes: "simple",
    },
  });

  campuses.forEach((campus: any) => {
    if (campus && campus.attributeValues.campusImage.value) {
      campus.image = createImageUrlFromGuid(
        campus.attributeValues.campusImage.value
      );
    }
  });

  const bgVideo = await fetchWistiaData({ id: "padj4c4xoh", size: 960 });

  return { bgVideo, campuses };
}
