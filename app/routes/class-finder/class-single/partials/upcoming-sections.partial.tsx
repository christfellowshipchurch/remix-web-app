import { useMemo } from "react";
import { Configure, InstantSearch, useHits } from "react-instantsearch";

import { escapeAlgoliaFilterString } from "~/components/finders/finder-algolia.utils";
import { FinderStickyBar } from "~/components/finders/finder-sticky-bar.component";
import { SearchFilters } from "~/components/finders/search-filters";
import { ActiveFilters } from "~/components/finders/search-filters/active-filter.component";
import { UpcomingSessionsCarousel } from "../components/upcoming-sessions-carousel.component";
import {
  CLASS_SINGLE_UPCOMING_INDEX_NAME,
  useClassSingleUpcomingInstantSearch,
} from "../hooks/use-class-single-upcoming-instant-search";
import type { ClassHitType } from "../../types";
import OnDemandCard from "../components/on-demand-card.component";
import { ClassSingleGroupsSection } from "./groups.partial";

const LOCATION_FILTERS_HINT = "Location filters are applied.";

/**
 * One Algolia response loads enough hits for carousel slides + geo/virtual ordering (Algolia max per request).
 */
const CLASS_SINGLE_UPCOMING_MAX_HITS = 1000;

function parseStartMs(hit: ClassHitType): number {
  const t = new Date(hit.startDate).getTime();
  return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

function compareStartDateAsc(a: ClassHitType, b: ClassHitType): number {
  const byDate = parseStartMs(a) - parseStartMs(b);
  if (byDate !== 0) return byDate;
  return a.objectID.localeCompare(b.objectID);
}

function geoDistanceMeters(hit: ClassHitType): number {
  const d = hit._rankingInfo?.geoDistance;
  if (d == null || typeof d !== "number" || Number.isNaN(d) || d <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return d;
}

/**
 * Without geo: soonest `startDate` first only. With geo: in-person by distance then date; Virtual last.
 */
function sortUpcomingSessionHitsForDisplay(
  items: ClassHitType[],
  geoActive: boolean,
): ClassHitType[] {
  if (!geoActive) {
    return [...items].sort(compareStartDateAsc);
  }

  const inPerson: ClassHitType[] = [];
  const virtual: ClassHitType[] = [];
  for (const hit of items) {
    if (hit.format === "Virtual") virtual.push(hit);
    else inPerson.push(hit);
  }

  virtual.sort(compareStartDateAsc);

  inPerson.sort((a, b) => {
    const distDiff = geoDistanceMeters(a) - geoDistanceMeters(b);
    if (distDiff !== 0) return distDiff;
    return compareStartDateAsc(a, b);
  });

  return [...inPerson, ...virtual];
}

function ClassSingleUpcomingResultsInner({
  geoActive,
}: {
  geoActive: boolean;
}) {
  const { items } = useHits<ClassHitType>();

  const ordered = useMemo(
    () => sortUpcomingSessionHitsForDisplay(items, geoActive),
    [items, geoActive],
  );

  const carouselResetKey = ordered.map((h) => h.objectID).join("|");

  return (
    <div
      data-upcoming-sessions-results
      className="scroll-mt-[100px]w-full max-w-[1296px] mr-auto"
    >
      <h3 className="pt-2 text-2xl font-extrabold mb-6 md:pt-4">
        Join a Class
      </h3>
      <div className="flex w-full justify-center md:justify-start">
        <UpcomingSessionsCarousel hits={ordered} resetKey={carouselResetKey} />
      </div>
    </div>
  );
}

/**
 * One InstantSearch for class-single upcoming sessions (mobile + desktop share URL, geo, and refinements).
 * `ClassSingleGroupsSection` is a nested Algolia `Index` (`dev_daniel_Groups`) that mirrors the same refinements + geo via `Configure`.
 */
export function ClassSingleUpcomingSearch({
  classHeroCoverImageUri,
  classType,
}: {
  classHeroCoverImageUri: string;
  classType: string;
}) {
  const upcoming = useClassSingleUpcomingInstantSearch();

  return (
    <InstantSearch
      indexName={CLASS_SINGLE_UPCOMING_INDEX_NAME}
      searchClient={upcoming.searchClient}
      initialUiState={upcoming.initialUiState}
      onStateChange={upcoming.onStateChange}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <ResponsiveClassesSingleConfigure
        classUrl={upcoming.classUrl}
        coordinates={upcoming.coordinates}
      />

      <div className="flex w-full flex-col pagination-scroll-to" id="search">
        {/* Mobile Filters */}
        <div className="flex flex-col md:hidden">
          <div className="content-padding mx-auto w-full max-w-screen-content">
            <h2 className="w-full text-[28px] font-extrabold">
              Filter Sessions
            </h2>
          </div>
          <div className="flex w-screen min-w-0 flex-col">
            <FinderStickyBar>
              <div className="mx-auto flex max-w-screen-content flex-col gap-3 py-4">
                <SearchFilters
                  onClearAllToUrl={upcoming.clearAllFiltersFromUrl}
                  desktopFilters={upcoming.desktopFilters}
                  compactInlineFilterCount={2}
                  isFilterPillSupplementallyActive={
                    upcoming.isFilterPillSupplementallyActive
                  }
                />
              </div>
              <ActiveFilters
                onClearAllToUrl={upcoming.clearAllFiltersFromUrl}
                additionalFiltersActive={upcoming.geoFiltersActive}
                additionalFiltersHint={LOCATION_FILTERS_HINT}
              />
            </FinderStickyBar>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="relative hidden w-full flex-col md:flex">
          <FinderStickyBar>
            <div className="mx-auto flex max-w-screen-content flex-col gap-3 pt-8 py-4 lg:min-h-20 lg:flex-row lg:items-center lg:gap-4 pagination-scroll-to">
              <div className="flex w-fit shrink-0 items-center gap-4">
                <h2 className="w-fit min-w-[260px] text-[28px] font-extrabold">
                  Filter Sessions
                </h2>
                <div className="hidden h-full w-px bg-text-secondary lg:block" />
              </div>
              <div className="min-w-0 flex-1">
                <SearchFilters
                  onClearAllToUrl={upcoming.clearAllFiltersFromUrl}
                  desktopFilters={upcoming.desktopFilters}
                  compactInlineFilterCount={2}
                  isFilterPillSupplementallyActive={
                    upcoming.isFilterPillSupplementallyActive
                  }
                />
              </div>
            </div>
            <ActiveFilters
              onClearAllToUrl={upcoming.clearAllFiltersFromUrl}
              additionalFiltersActive={upcoming.geoFiltersActive}
              additionalFiltersHint={LOCATION_FILTERS_HINT}
            />
          </FinderStickyBar>
        </div>

        <div className="flex w-full flex-col bg-gray py-8 content-padding md:pt-12 md:pb-20">
          <div className="mx-auto w-full max-w-screen-content">
            <ClassSingleUpcomingResultsInner
              geoActive={upcoming.geoFiltersActive}
            />
          </div>

          {/* On Demand Section*/}
          <div className="mx-auto w-full max-w-screen-content flex flex-col gap-4 items-center mt-8">
            <div className="w-full max-w-[1296px] mr-auto py-16 border-t border-neutral-lighter">
              <h2 className="text-2xl font-extrabold w-full leading-[1.4]">
                Take It Anytime
              </h2>
              <OnDemandCard
                title={classType}
                image={classHeroCoverImageUri}
                link="#todo"
              />
            </div>
            <div className="w-full max-w-[1296px] mr-auto py-16 border-t border-neutral-lighter">
              <ClassSingleGroupsSection
                coordinates={upcoming.coordinates}
                classUrl={upcoming.classUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}

export const ResponsiveClassesSingleConfigure = ({
  classUrl,
  coordinates,
}: {
  classUrl: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
}) => {
  const classTypeFilter = classUrl
    ? `classType:"${escapeAlgoliaFilterString(classUrl)}"`
    : undefined;

  return (
    <Configure
      key={`${classUrl}-${coordinates?.lat ?? ""}-${coordinates?.lng ?? ""}`}
      hitsPerPage={CLASS_SINGLE_UPCOMING_MAX_HITS}
      filters={classTypeFilter}
      aroundLatLng={
        coordinates?.lat != null && coordinates?.lng != null
          ? `${coordinates.lat}, ${coordinates.lng}`
          : undefined
      }
      aroundRadius="all"
      aroundLatLngViaIP={false}
      getRankingInfo={true}
    />
  );
};
