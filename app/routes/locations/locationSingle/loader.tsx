import { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { CampusData } from "~/lib/types/rockTypes";
import { normalize } from "~/lib/utils";

const baseUrl = process.env.ROCK_API;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");

  // Fetch Campus Data
  const res = await fetch(
    `${baseUrl}Campuses?$filter=Url eq '${params?.location}'&loadAttributes=simple`,
    {
      headers: {
        ...defaultHeaders,
      },
    }
  );
  const data = await res.json();
  return { data: normalize(data) as CampusData[] };
};
