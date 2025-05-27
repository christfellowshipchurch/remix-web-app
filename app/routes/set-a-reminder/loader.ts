import { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/lib/.server/authentication/get-user-from-request";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { dayTimes, formattedServiceTimes } from "~/lib/utils";

export type LoaderReturnType = {
  serviceTimes: dayTimes[];
  campusName: string;
  user: any;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const campusUrl = url.searchParams.get("location") as string;

  const user = (await getUserFromRequest(request)) || null;

  const data = await fetchRockData({
    endpoint: "Campuses",
    queryParams: {
      $filter: `Url eq '${campusUrl}'`,
      $expand: "Location",
      loadAttributes: "simple",
    },
  });

  if (!data || data.length === 0) {
    throw new Response("Campus not found at: /locations/" + campusUrl, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { serviceTimes, name } = data;

  return {
    serviceTimes: formattedServiceTimes(serviceTimes),
    campusName: name,
    user,
  };
};
