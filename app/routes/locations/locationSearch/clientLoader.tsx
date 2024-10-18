import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { normalize } from "~/lib/utils";

const baseUrl = process.env.ROCK_API;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

type LoaderReturnType = {};

// export async function clientLoader() {
// Fetch Campus Data
//   const res = await fetch(
//     `${baseUrl}Campuses?$filter=Url eq '${params?.location}'&loadAttributes=simple`,
//     {
//       headers: {
//         ...defaultHeaders,
//       },
//     }
//   );
//   const data = await res.json();
//   return { data: normalize(data) as LoaderReturnType[] };
// }

export async function clientLoader({
  request,
  params,
}: ClientLoaderFunctionArgs) {
  console.log(params, request);
  const address = params;
  return { address };
}
