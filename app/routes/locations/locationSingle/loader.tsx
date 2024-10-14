import { LoaderFunctionArgs } from "@remix-run/node";
import { camelCase, mapKeys, mapValues } from "lodash";
import invariant from "tiny-invariant";
import { CampusData } from "~/lib/types/rockTypes";

const baseUrl = process.env.ROCK_API;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");
  function normalize(data: object): object {
    if (Array.isArray(data)) return data.map((n) => normalize(n));
    if (typeof data !== "object" || data === null) return data;
    const normalizedValues = mapValues(data, (n) => normalize(n));
    return mapKeys(normalizedValues, (value, key: string) => camelCase(key));
  }

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
