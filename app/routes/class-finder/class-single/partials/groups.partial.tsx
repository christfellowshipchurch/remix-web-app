import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
} from "react-instantsearch";

import {
  escapeAlgoliaFilterString,
  type FinderGeoCoordinates,
} from "~/components/finders/finder-algolia.utils";
import { createSearchClient } from "~/lib/create-search-client";
import type { GroupType } from "~/routes/group-finder/types";

import { ClassSingleGroupsCarousel } from "../components/class-single-groups-carousel.component";
import type { LoaderReturnType } from "../loader";

/**
 * Keep in sync with `app/routes/group-finder/partials/group-search.partial.tsx`.
 */
const GROUPS_ALGOLIA_INDEX_NAME = "dev_daniel_Groups";

const CLASS_SINGLE_GROUPS_MAX_HITS = 1000;

/** Blank query = all groups (up to hitsPerPage). Swap with class-type search below when ready. */
const HARDCODED_GROUPS_SEARCH_QUERY = "";

function mapClassFormatToGroupMeetingType(format: string): string | null {
  if (format === "Virtual") return "Online";
  if (format === "In-Person") return "In Person";
  return null;
}

function mapClassLanguageToGroupLanguage(lang: string): string | null {
  if (lang === "English") return "English";
  if (lang === "Español" || lang === "Spanish") return "Spanish";
  return null;
}

/**
 * Maps `dev_Classes` refinement facets (Filter Sessions) to `dev_daniel_Groups` Algolia filter string.
 * `campus` matches RefinementList `attribute: "campus"` (class-single + group finder).
 */
function buildClassSingleGroupsAlgoliaFilters(
  refinementList: Record<string, string[]>,
): string | undefined {
  const parts: string[] = [];

  const campuses = (refinementList.campus ?? []).filter(
    (v) => v != null && String(v).trim() !== "",
  );
  if (campuses.length === 1) {
    parts.push(`campus:"${escapeAlgoliaFilterString(campuses[0])}"`);
  } else if (campuses.length > 1) {
    parts.push(
      `(${campuses.map((c) => `campus:"${escapeAlgoliaFilterString(c)}"`).join(" OR ")})`,
    );
  }

  const formats = (refinementList.format ?? []).filter(
    (v) => v != null && String(v).trim() !== "",
  );
  const meetingTypes = [
    ...new Set(
      formats
        .map((f) => mapClassFormatToGroupMeetingType(f))
        .filter((m): m is string => m != null),
    ),
  ];
  if (meetingTypes.length === 1) {
    parts.push(`meetingType:"${escapeAlgoliaFilterString(meetingTypes[0])}"`);
  } else if (meetingTypes.length > 1) {
    parts.push(
      `(${meetingTypes.map((m) => `meetingType:"${escapeAlgoliaFilterString(m)}"`).join(" OR ")})`,
    );
  }

  const languages = (refinementList.language ?? []).filter(
    (v) => v != null && String(v).trim() !== "",
  );
  const groupLanguages = [
    ...new Set(
      languages
        .map((l) => mapClassLanguageToGroupLanguage(l))
        .filter((l): l is string => l != null),
    ),
  ];
  if (groupLanguages.length === 1) {
    parts.push(`language:"${escapeAlgoliaFilterString(groupLanguages[0])}"`);
  } else if (groupLanguages.length > 1) {
    parts.push(
      `(${groupLanguages.map((l) => `language:"${escapeAlgoliaFilterString(l)}"`).join(" OR ")})`,
    );
  }

  if (parts.length === 0) return undefined;
  return parts.join(" AND ");
}

function ClassSingleGroupsHitsInner({ backUrl }: { backUrl: string }) {
  const { items } = useHits<GroupType>();
  const resetKey = items.map((h) => h.objectID).join("|");

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
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

function ClassSingleGroupsAlgoliaIsland({
  classUrl,
  mirroredFacetFilters,
  aroundLatLng,
}: {
  classUrl: string;
  mirroredFacetFilters: string | undefined;
  aroundLatLng: string | undefined;
}) {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  const backUrl = `/class-finder/${classUrl}`;

  const configureKey = `${mirroredFacetFilters ?? ""}|${aroundLatLng ?? ""}`;

  return (
    <InstantSearch
      key={classUrl}
      indexName={GROUPS_ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
      initialUiState={{
        [GROUPS_ALGOLIA_INDEX_NAME]: {
          query: HARDCODED_GROUPS_SEARCH_QUERY,
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure
        key={configureKey}
        hitsPerPage={CLASS_SINGLE_GROUPS_MAX_HITS}
        query={HARDCODED_GROUPS_SEARCH_QUERY}
        filters={mirroredFacetFilters}
        aroundLatLng={aroundLatLng}
        aroundRadius="all"
        aroundLatLngViaIP={false}
        getRankingInfo={aroundLatLng != null}
      />
      <ClassSingleGroupsHitsInner backUrl={backUrl} />
    </InstantSearch>
  );
}

export type ClassSingleGroupsSectionProps = {
  coordinates: FinderGeoCoordinates;
  classUrl: string;
};

/**
 * Reads Filter Sessions state from the parent `dev_Classes` InstantSearch, then runs a separate
 * groups `InstantSearch` with mirrored `Configure` (nested `Index` was unreliable: helper can stay null so hits never mount).
 */
export function ClassSingleGroupsSection({
  coordinates,
  classUrl,
}: ClassSingleGroupsSectionProps) {
  const { indexUiState } = useInstantSearch();
  const refinementList = useMemo(
    () => (indexUiState.refinementList ?? {}) as Record<string, string[]>,
    [indexUiState.refinementList],
  );

  const mirroredFacetFilters = useMemo(
    () => buildClassSingleGroupsAlgoliaFilters(refinementList),
    [refinementList],
  );

  const aroundLatLng =
    coordinates != null &&
    coordinates.lat != null &&
    coordinates.lng != null &&
    !Number.isNaN(coordinates.lat) &&
    !Number.isNaN(coordinates.lng)
      ? `${coordinates.lat}, ${coordinates.lng}`
      : undefined;

  return (
    <ClassSingleGroupsAlgoliaIsland
      classUrl={classUrl}
      mirroredFacetFilters={mirroredFacetFilters}
      aroundLatLng={aroundLatLng}
    />
  );
}
