import { useLoaderData } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Configure, InstantSearch, useHits } from "react-instantsearch";

import { createSearchClient } from "~/lib/create-search-client";
import { Button } from "~/primitives/button/button.primitive";

import type { Volunteer } from "../types";
import type { LoaderReturnType } from "./loader";

import { VolunteerSingle } from "./partials/volunteer-single.partial";

/** Algolia index for volunteer / mission trips (GUID = `groupGuid`). */
export const DEV_MISSIONS_INDEX_NAME = "dev_Missions";

export { VolunteerSingle };

/** Uppercase match — Algolia query + exact `groupGuid` on hits (facets often omit `groupGuid`). */
function normalizeGroupGuid(value: string): string {
  return value.trim().toUpperCase();
}

export function MissionNotFound() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-center text-2xl font-bold">Mission not found</h2>
      <p className="max-w-md text-center text-neutral-500">
        We couldn&apos;t find a mission for this link. It may have been removed
        or the address may be incorrect.
      </p>
      <Button intent="primary" href="/volunteer">
        Back to Volunteer
      </Button>
    </div>
  );
}

function MissionHits({ groupGuid }: { groupGuid: string }) {
  const { items } = useHits<Volunteer>();
  const want = normalizeGroupGuid(groupGuid);
  const hit = items.find((h) => normalizeGroupGuid(h.groupGuid ?? "") === want);

  if (!hit) {
    return <MissionNotFound />;
  }

  return <VolunteerSingle hit={hit} />;
}

export function VolunteerSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, groupGuid } =
    useLoaderData<LoaderReturnType>();
  const [isVisible, setIsVisible] = useState(false);

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isVisible ? "animate-fadeIn duration-400" : "opacity-0"
      }`}
    >
      <InstantSearch
        indexName={DEV_MISSIONS_INDEX_NAME}
        searchClient={searchClient}
        key={groupGuid}
      >
        <Configure query={groupGuid} hitsPerPage={50} />
        <MissionHits groupGuid={groupGuid} />
      </InstantSearch>
    </div>
  );
}
