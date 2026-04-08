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

/**
 * `classesIndexClassType` must match `dev_Classes` / `dev_daniel_Groups` attribute `classType`
 * (the class-type value on records), not necessarily the URL segment.
 */
function composeGroupsFilters(
  classesIndexClassType: string,
  mirroredFacetFilters: string | undefined,
): string | undefined {
  const trimmed = classesIndexClassType.trim();
  const classTypeFilter = trimmed
    ? `classType:"${escapeAlgoliaFilterString(trimmed)}"`
    : null;
  if (classTypeFilter && mirroredFacetFilters) {
    return `${classTypeFilter} AND ${mirroredFacetFilters}`;
  }
  if (classTypeFilter) return classTypeFilter;
  return mirroredFacetFilters;
}

function classFormatToMeetingType(format: string): string | null {
  if (format === "Virtual") return "Online";
  if (format === "In-Person") return "In Person";
  return null;
}

function classLanguageToGroupLanguage(lang: string): string | null {
  if (lang === "English") return "English";
  if (lang === "Español" || lang === "Spanish") return "Spanish";
  return null;
}

/**
 * Maps `dev_Classes` refinement facets (Filter Sessions) to `dev_daniel_Groups` Algolia filter string.
 * `campus` matches RefinementList `attribute: "campus"` (class-single + group finder).
 */
function mirrorGroupsFacets(
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
        .map((f) => classFormatToMeetingType(f))
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
        .map((l) => classLanguageToGroupLanguage(l))
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

function ClassSingleGroupsHits({ backUrl }: { backUrl: string }) {
  const { items } = useHits<GroupType>();
  const resetKey = items.map((h) => h.objectID).join("|");

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[1296px] mr-auto py-16 border-t border-neutral-lighter">
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
    </div>
  );
}

function ClassSingleGroupsAlgolia({
  classUrl,
  classesIndexClassType,
  mirroredFacetFilters,
  aroundLatLng,
}: {
  classUrl: string;
  classesIndexClassType: string;
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

  const configureFilters = useMemo(
    () =>
      composeGroupsFilters(
        classesIndexClassType,
        mirroredFacetFilters,
      ),
    [classesIndexClassType, mirroredFacetFilters],
  );

  const configureKey = `${classesIndexClassType}|${configureFilters ?? ""}|${aroundLatLng ?? ""}`;

  return (
    <InstantSearch
      key={`${classUrl}|${classesIndexClassType}`}
      indexName={GROUPS_ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
      initialUiState={{
        [GROUPS_ALGOLIA_INDEX_NAME]: {
          query: "",
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure
        key={configureKey}
        hitsPerPage={CLASS_SINGLE_GROUPS_MAX_HITS}
        query=""
        filters={configureFilters}
        aroundLatLng={aroundLatLng}
        aroundRadius="all"
        aroundLatLngViaIP={false}
        getRankingInfo={aroundLatLng != null}
      />
      <ClassSingleGroupsHits backUrl={backUrl} />
    </InstantSearch>
  );
}

export type ClassSingleGroupsSectionProps = {
  coordinates: FinderGeoCoordinates;
  classUrl: string;
  /** `classType` from the current `dev_Classes` hit — used for Groups `classType` facet filter. */
  classesIndexClassType: string;
};

/**
 * Reads Filter Sessions state from the parent `dev_Classes` InstantSearch, then runs a separate
 * groups `InstantSearch` with mirrored `Configure` (nested `Index` was unreliable: helper can stay null so hits never mount).
 */
export function ClassSingleGroupsSection({
  coordinates,
  classUrl,
  classesIndexClassType,
}: ClassSingleGroupsSectionProps) {
  const { indexUiState } = useInstantSearch();
  const refinementList = useMemo(
    () => (indexUiState.refinementList ?? {}) as Record<string, string[]>,
    [indexUiState.refinementList],
  );

  const mirroredFacetFilters = useMemo(
    () => mirrorGroupsFacets(refinementList),
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
    <ClassSingleGroupsAlgolia
      classUrl={classUrl}
      classesIndexClassType={classesIndexClassType}
      mirroredFacetFilters={mirroredFacetFilters}
      aroundLatLng={aroundLatLng}
    />
  );
}
