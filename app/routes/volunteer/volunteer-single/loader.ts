import type { LoaderFunction } from "react-router-dom";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  /** Rock GUID from the URL — matches Algolia `groupGuid` on `dev_Missions`. */
  groupGuid: string;
};

/** UUID / Rock GUID (with hyphens), case-insensitive. */
const ROCK_GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const loader: LoaderFunction = async ({ params }) => {
  const raw = decodeURIComponent(params.path ?? "").trim();
  if (!raw || !ROCK_GUID_RE.test(raw)) {
    throw new Response("Mission not found", { status: 404 });
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new Response("Search not configured", { status: 503 });
  }

  // Algolia stores mission groupGuid values in uppercase.
  const groupGuid = raw.toUpperCase();

  const pageData: LoaderReturnType = {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    groupGuid,
  };

  return Response.json(pageData);
};
