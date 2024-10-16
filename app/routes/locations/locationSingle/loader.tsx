import { json, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { fetchRockData } from "~/lib/server/fetchRockData.server";

export type LoaderReturnType = {
  name: string;
  phoneNumber: string;
  // address: string;
  // url: string;
  // serviceTimes: string;
  // campusMap: string;
  // instagram: string;
  // facebook: string;
  // youtube: string;
  // Add other properties as needed
};

const fetchCampusData = async (campusUrl: string) => {
  return fetchRockData("Campuses", {
    $filter: `Url eq '${campusUrl}'`,
    loadAttributes: "simple",
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");

  const campusUrl = params.location as string;
  const data = await fetchCampusData(campusUrl);

  if (!data) {
    throw new Error("No data found");
  }

  const { name, phoneNumber } = data;

  const pageData: LoaderReturnType = {
    name,
    phoneNumber,
  };

  return json<LoaderReturnType>(pageData);
};
