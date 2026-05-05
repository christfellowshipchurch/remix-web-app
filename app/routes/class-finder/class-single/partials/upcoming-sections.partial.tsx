import { useMemo } from 'react';
import { Configure, InstantSearch, useHits } from 'react-instantsearch';

import { escapeAlgoliaFilterString } from '~/components/finders/finder-algolia.utils';
import { FinderStickyBar } from '~/components/finders/finder-sticky-bar.component';
import { SearchFilters } from '~/components/finders/search-filters';
import { ActiveFilters } from '~/components/finders/search-filters/active-filter.component';
import { UpcomingSessionsCarousel } from '../components/upcoming-sessions-carousel.component';
import {
  CLASS_SINGLE_UPCOMING_INDEX_NAME,
  useClassSingleUpcomingInstantSearch,
} from '../hooks/use-class-single-upcoming-instant-search';
import type { ClassHitType } from '../../types';
import OnDemandCard from '../components/on-demand-card.component';
import { ClassSingleGroupsSection } from './groups.partial';

const LOCATION_FILTERS_HINT = 'Location filters are applied.';

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
  if (d == null || typeof d !== 'number' || Number.isNaN(d) || d <= 0) {
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
    if (hit.format === 'Virtual') virtual.push(hit);
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

/**
 * One InstantSearch for class-single upcoming sessions (mobile + desktop share URL, geo, and refinements).
 * `ClassSingleGroupsSection` is a nested Algolia `Index` (`dev_Groups`) that mirrors the same refinements + geo via `Configure`.
 */
export function ClassSingleUpcomingSearch({
  classHeroCoverImageUri,
  classType,
  onDemandUrl,
}: {
  classHeroCoverImageUri: string;
  classType: string;
  onDemandUrl: string;
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
        classesIndexClassType={classType}
        classUrl={upcoming.classUrl}
        coordinates={upcoming.coordinates}
      />

      <div className='flex w-full flex-col pagination-scroll-to' id='search'>
        {/*
          One column wraps heading + sticky filters + results so `position: sticky`
          on FinderStickyBar is constrained by a tall ancestor (see MDN: sticky is
          limited to the parent box). Splitting filters and results into siblings
          made each filter parent too short, so the bar scrolled away on both breakpoints.
        */}
        <div className='flex min-w-0 w-full flex-col max-md:pt-6'>
          <FinderStickyBar className='max-md:shadow-none'>
            <h2 className='w-full pb-2 text-[28px] font-extrabold md:hidden'>
              Filter Sessions
            </h2>
            <div className='mx-auto flex w-full min-w-0 max-w-screen-content flex-col gap-3 py-3 md:py-4 md:pt-8 lg:min-h-20 lg:flex-row lg:items-center lg:gap-4'>
              <div className='hidden w-fit shrink-0 items-center gap-4 md:flex'>
                <h2 className='w-fit min-w-[260px] text-[28px] font-extrabold'>
                  Filter Sessions
                </h2>
                <div className='hidden h-full w-px bg-text-secondary lg:block' />
              </div>
              <div className='min-w-0 flex-1'>
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

          <div className='flex w-full flex-col bg-gray py-8 pl-5 md:pl-12 lg:pl-18 lg:pr-18 md:pt-12 md:pb-20'>
            <div className='mx-auto w-full max-w-screen-content'>
              <ClassSingleUpcomingResults
                geoActive={upcoming.geoFiltersActive}
              />
            </div>

            {/* On Demand Section*/}
            <div className='mx-auto mt-8 flex w-full max-w-screen-content flex-col items-center gap-4'>
              {onDemandUrl && (
                <div className='mr-auto flex w-full max-w-[1296px] flex-col gap-4 border-t border-neutral-lighter py-16'>
                  <h2 className='w-full text-2xl leading-[1.4] font-extrabold'>
                    Take It Anytime
                  </h2>
                  <OnDemandCard
                    title={classType}
                    image={classHeroCoverImageUri}
                    link={onDemandUrl}
                  />
                </div>
              )}

              <ClassSingleGroupsSection
                coordinates={upcoming.coordinates}
                classUrl={upcoming.classUrl}
                classesIndexClassType={classType}
              />
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}

export const ResponsiveClassesSingleConfigure = ({
  classesIndexClassType,
  classUrl,
  coordinates,
}: {
  /** `classType` on `dev_Classes` records (not necessarily the URL slug). */
  classesIndexClassType: string;
  classUrl: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
}) => {
  const trimmed = classesIndexClassType.trim();
  const classTypeFilter = trimmed
    ? `classType:"${escapeAlgoliaFilterString(trimmed)}"`
    : undefined;

  return (
    <Configure
      key={`${classUrl}-${trimmed}-${coordinates?.lat ?? ''}-${coordinates?.lng ?? ''}`}
      hitsPerPage={CLASS_SINGLE_UPCOMING_MAX_HITS}
      filters={classTypeFilter}
      aroundLatLng={
        coordinates?.lat != null && coordinates?.lng != null
          ? `${coordinates.lat}, ${coordinates.lng}`
          : undefined
      }
      aroundRadius='all'
      aroundLatLngViaIP={false}
      getRankingInfo={true}
    />
  );
};

function ClassSingleUpcomingResults({ geoActive }: { geoActive: boolean }) {
  const { items } = useHits<ClassHitType>();

  const ordered = useMemo(
    () => sortUpcomingSessionHitsForDisplay(items, geoActive),
    [items, geoActive],
  );

  const carouselResetKey = ordered.map((h) => h.objectID).join('|');

  return (
    <div
      data-upcoming-sessions-results
      className='scroll-mt-[100px] w-full max-w-[1296px] mr-auto'
    >
      <h3 className='pt-2 text-2xl font-extrabold mb-6 md:pt-4'>
        Join a Class
      </h3>
      <div className='flex w-full justify-center md:justify-start'>
        <UpcomingSessionsCarousel hits={ordered} resetKey={carouselResetKey} />
      </div>
    </div>
  );
}
