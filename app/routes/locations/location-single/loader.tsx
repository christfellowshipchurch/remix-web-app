import { LoaderFunctionArgs } from "react-router";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  campusName: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const campusName = params.location;

  if (!campusName) {
    throw new Response("Campus not found", {
      status: 404,
    });
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new Response("Algolia credentials not found", {
      status: 404,
    });
  }

  return {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    campusName: decodeURIComponent(campusName),
  };
}
