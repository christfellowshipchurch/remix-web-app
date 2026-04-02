import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { Configure, InstantSearch, useHits } from "react-instantsearch";

import { createSearchClient } from "~/lib/create-search-client";
import type { GroupType } from "~/routes/group-finder/types";

import { ClassSingleGroupsCarousel } from "../components/class-single-groups-carousel.component";
import type { LoaderReturnType } from "../loader";

/**
 * Keep in sync with `app/routes/group-finder/partials/group-search.partial.tsx`.
 * This widget runs in its own InstantSearch context: sticky-bar filters above target `dev_Classes` only, not these hits.
 */
const GROUPS_ALGOLIA_INDEX_NAME = "dev_daniel_Groups";

const CLASS_SINGLE_GROUPS_MAX_HITS = 1000;

/** Blank query = all groups (up to hitsPerPage). Swap with class-type search below when ready. */
const HARDCODED_GROUPS_SEARCH_QUERY = "";

// function classUrlToClassTypeSearchQuery(classUrl: string): string {
//   return decodeURIComponent(classUrl).replace(/-/g, " ").trim();
// }

function ClassSingleGroupsHitsInner({ backUrl }: { backUrl: string }) {
  const { items } = useHits<GroupType>();
  const resetKey = items.map((h) => h.objectID).join("|");

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-content flex-col items-center gap-4 border-t border-neutral-lighter py-16 mt-8">
      <h2 className="w-full text-2xl font-extrabold leading-[1.4]">
        Join a Group
      </h2>
      <div className="flex w-full justify-center md:justify-start">
        <ClassSingleGroupsCarousel
          hits={items}
          resetKey={resetKey}
          backUrl={backUrl}
        />
      </div>
    </div>
  );
}

export function ClassSingleGroupsSection() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, classUrl } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  // const classTypeSearchQuery = useMemo(
  //   () => classUrlToClassTypeSearchQuery(classUrl),
  //   [classUrl],
  // );

  const groupsSearchQuery = HARDCODED_GROUPS_SEARCH_QUERY;
  // const groupsSearchQuery = classTypeSearchQuery;

  const backUrl = `/class-finder/${classUrl}`;

  return (
    <InstantSearch
      key={classUrl}
      indexName={GROUPS_ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
      initialUiState={{
        [GROUPS_ALGOLIA_INDEX_NAME]: {
          query: groupsSearchQuery,
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      {/*
      <Configure
        hitsPerPage={CLASS_SINGLE_GROUPS_MAX_HITS}
        query={classTypeSearchQuery}
        restrictSearchableAttributes={["classType"]}
      />
      */}
      <Configure
        hitsPerPage={CLASS_SINGLE_GROUPS_MAX_HITS}
        query={groupsSearchQuery}
      />
      <ClassSingleGroupsHitsInner backUrl={backUrl} />
    </InstantSearch>
  );
}
