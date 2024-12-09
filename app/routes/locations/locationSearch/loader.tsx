import { LoaderFunctionArgs } from "@remix-run/node";
import { fetchRockData } from "~/lib/.server/fetchRockData";
import { Campus } from "./partials/locations-list.partial";
import { createImageUrlFromGuid } from "~/lib/utils";
import { fetchWistiaData } from "~/lib/.server/fetchWistiaData";

export type CampusesReturnType = {
  campuses: Campus[];
  bgVideo: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const campuses: Campus[] = await fetchRockData("Campuses", {
    $filter: `IsActive eq true`,
    $expand: "Location",
    $orderby: "Order",
    loadAttributes: "simple",
  });

  campuses.forEach((campus: any) => {
    if (campus && campus.attributeValues.campusImage.value) {
      campus.image = createImageUrlFromGuid(
        campus.attributeValues.campusImage.value
      );
    }
  });

  const bgVideo = await fetchWistiaData({ id: "padj4c4xoh", size: 1280 });

  return { bgVideo, campuses };
}
