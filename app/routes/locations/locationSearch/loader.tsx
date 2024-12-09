import { LoaderFunctionArgs } from "@remix-run/node";
import { fetchRockData } from "~/lib/.server/fetchRockData";
import { Campus } from "./partials/locations-list.partial";
import { createImageUrlFromGuid } from "~/lib/utils";

export type CampusesReturnType = {
  campuses: Campus[];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const campuses: Campus[] = await fetchRockData("Campuses", {
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

  return { campuses };
}
