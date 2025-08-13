import { LoaderFunction } from "react-router-dom";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  campusUrl: string;
  allCampuses: string[]; // TODO: Remove this once we have a better way to get all campuses URLs
  campusName: string;
};

const allCampuses = [
  "palm-beach-gardens",
  "iglesia-palm-beach-gardens",
  "iglesia-royal-palm-beach",
  "royal-palm-beach",
  "cf-everywhere",
  // "online",
  "vero-beach",
  "boynton-beach",
  "jupiter",
  "port-st-lucie",
  "stuart",
  "okeechobee",
  "belle-glade",
  "boca-raton",
  "westlake",
  "trinity",
];

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
    allCampuses: allCampuses, // TODO: Remove this once we have a better way to get all campuses URLs
  };

  return pageData;
};
