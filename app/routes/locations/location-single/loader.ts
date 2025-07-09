import { LoaderFunction } from "react-router-dom";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  campusUrl: string;
  campusName: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const campusUrl = params.location;

  if (!campusUrl) {
    throw new Response("Campus not found", {
      status: 404,
    });
  }

  const campusName = decodeURIComponent(campusUrl || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  if (!campusUrl) {
    throw new Response("Campus not found", {
      status: 404,
    });
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!appId || !searchApiKey || !googleMapsApiKey) {
    throw new Response("Keys not found", {
      status: 404,
    });
  }

  const pageData: LoaderReturnType = {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    GOOGLE_MAPS_API_KEY: googleMapsApiKey,
    campusUrl: decodeURIComponent(campusUrl),
    campusName: campusName,
  };

  return pageData;
};
