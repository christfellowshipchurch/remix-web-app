import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigation } from 'react-router-dom';
import { InstantSearch } from 'react-instantsearch';

import { FinderStickyBar } from '~/components/finders/finder-sticky-bar.component';
import { SearchFilters } from '~/components/finders/search-filters';
import { ActiveFilters } from '~/components/finders/search-filters/active-filter.component';
import { cn } from '~/lib/utils';

import { UpcomingSessionsCarousel } from '../components/upcoming-sessions-carousel.component';
import { ClassSingleFiltersSkeleton } from '../components/filters/class-single-filters-skeleton.component';
import {
  CLASS_SINGLE_UPCOMING_INDEX_NAME,
  useClassSingleUpcomingInstantSearch,
} from '../hooks/use-class-single-upcoming-instant-search';
import type { ClassHitType } from '../../types';
import type { LoaderReturnType } from '../loader';
import OnDemandCard from '../components/on-demand-card.component';
import { ClassSingleGroupsSection } from './groups.partial';

const LOCATION_FILTERS_HINT = 'Location filters are applied.';

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
 * Without geo: soonest `startDate` first. With geo: in-person by distance then date; Virtual last.
 * Sorting stays client-side; loader supplies hits (with `_rankingInfo` when lat/lng are in the URL).
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
 * Class-single upcoming sessions:
 * - Loader prefetches carousel hits + facets (URL-driven, incl. lat/lng).
 * - Filter bar uses InstantSearch + loader-backed SearchClient (deferred until after hydration).
 * - Carousel renders outside `<Hits>` for fast first paint.
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
  const { upcomingHits, groupHits } = useLoaderData<LoaderReturnType>();
  const navigation = useNavigation();
  const upcoming = useClassSingleUpcomingInstantSearch();

  const isLoading = navigation.state === 'loading';

  /** SSR/hydration: skeleton filters until react-instantsearch mounts. */
  const [filtersMounted, setFiltersMounted] = useState(false);
  useEffect(() => {
    setFiltersMounted(true);
  }, []);

  return (
    <div className='flex w-full flex-col pagination-scroll-to' id='search'>
      <div className='flex min-w-0 w-full flex-col max-md:pt-6'>
        <FinderStickyBar className='max-md:shadow-none'>
          {filtersMounted ? (
            <InstantSearch
              indexName={CLASS_SINGLE_UPCOMING_INDEX_NAME}
              searchClient={upcoming.searchClient}
              initialUiState={upcoming.initialUiState}
              onStateChange={upcoming.onStateChange}
              future={{
                preserveSharedStateOnUnmount: true,
              }}
            >
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
            </InstantSearch>
          ) : (
            <div className='mx-auto flex w-full min-w-0 max-w-screen-content flex-col gap-3 py-3 md:py-4 md:pt-8 lg:min-h-20 lg:flex-row lg:items-center lg:gap-4'>
              <h2 className='w-full pb-2 text-[28px] font-extrabold md:hidden'>
                Filter Sessions
              </h2>
              <div className='hidden w-fit shrink-0 items-center gap-4 md:flex'>
                <h2 className='w-fit min-w-[260px] text-[28px] font-extrabold'>
                  Filter Sessions
                </h2>
                <div className='hidden h-full w-px bg-text-secondary lg:block' />
              </div>
              <ClassSingleFiltersSkeleton />
            </div>
          )}
        </FinderStickyBar>

        <div className='flex w-full flex-col bg-gray py-8 pl-5 md:pl-12 lg:pl-18 lg:pr-18 md:pt-12 md:pb-20'>
          <div className='mx-auto w-full max-w-screen-content'>
            <ClassSingleUpcomingResults
              hits={upcomingHits}
              geoActive={upcoming.geoFiltersActive}
              isLoading={isLoading}
            />
          </div>

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
              groupHits={groupHits}
              classUrl={upcoming.classUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassSingleUpcomingResults({
  hits,
  geoActive,
  isLoading,
}: {
  hits: ClassHitType[];
  geoActive: boolean;
  isLoading: boolean;
}) {
  const ordered = useMemo(
    () => sortUpcomingSessionHitsForDisplay(hits, geoActive),
    [hits, geoActive],
  );

  const carouselResetKey = ordered.map((h) => h.objectID).join('|');

  return (
    <div
      data-upcoming-sessions-results
      className={cn(
        'scroll-mt-[100px] w-full max-w-[1296px] transition-opacity',
        { 'opacity-50 pointer-events-none': isLoading },
      )}
    >
      <h3 className='pt-2 text-2xl font-extrabold mb-6 md:pt-4'>
        Join a Class
      </h3>
      {ordered.length === 0 ? (
        <p className='text-text-secondary pb-4'>
          No upcoming sessions match your filters. Try adjusting location or
          format.
        </p>
      ) : (
        <div className='flex w-full justify-center md:justify-start'>
          <UpcomingSessionsCarousel
            hits={ordered}
            resetKey={carouselResetKey}
          />
        </div>
      )}
    </div>
  );
}
