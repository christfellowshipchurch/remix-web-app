import type { LoaderFunction } from "react-router-dom";

import { fetchVolunteerMissionDetailFromRock } from "./volunteer-mission-rock.server";
import type { VolunteerMissionDetail } from "./types";

export type LoaderReturnType = {
  /** Rock GUID from the URL (uppercase) — canonical for links and meta. */
  groupGuid: string;
  mission: VolunteerMissionDetail;
  /** Optional — used only for Algolia `spotsLeft` on the mission intro. */
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
};

/** UUID / Rock GUID (with hyphens), case-insensitive. */
const ROCK_GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const loader: LoaderFunction = async ({ params }) => {
  const raw = decodeURIComponent(params.path ?? "").trim();
  if (!raw || !ROCK_GUID_RE.test(raw)) {
    throw new Response("Mission not found", { status: 404 });
  }

  if (!process.env.ROCK_API || !process.env.ROCK_TOKEN) {
    throw new Response("Mission data not configured", { status: 503 });
  }

  const groupGuid = raw.toUpperCase();

  const mission = await fetchVolunteerMissionDetailFromRock(groupGuid);
  if (!mission) {
    throw new Response("Mission not found", { status: 404 });
  }

  return Response.json({
    groupGuid,
    mission,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID ?? "",
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY ?? "",
  } satisfies LoaderReturnType);
};
