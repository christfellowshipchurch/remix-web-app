import { Link, useLoaderData } from 'react-router-dom';
import { useEffect, useMemo, useState, type RefObject } from 'react';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {
  Configure,
  InstantSearch,
  useInstantSearch,
  usePagination,
  useRefinementList,
} from 'react-instantsearch';

import { cn } from '~/lib/utils';
import { createInstantSearchUrlSync } from '~/components/finders/instant-search-url-sync/create-instant-search-url-sync';
import { useHydratedHitsFallback } from '~/components/finders/use-hydrated-hits-fallback';

import { SectionTitle } from '~/components';
import { Icon } from '~/primitives/icon/icon';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';
import { ResourceCard } from '~/primitives/cards/resource-card';
import type { ContentItemHit } from '~/routes/search/types';

import type { AllEventsLoaderData, EventFinderFacetItem } from '../loader';
import { useEventsAlgoliaRouting } from '../hooks/use-events-algolia-routing.hook';
import {
  FeaturedEventsFromHits,
  FeaturedEventsSectionLayout,
} from '../partials/featured-events.partial';
import { parseEventsFinderUrlState } from '../../events-url-state';
import type { EventsFinderUrlState } from '../../events-url-state';
import { buildEventSingleUrl } from '../../events-back-url';

import { formatEventCardDate } from './featured-card.component';
import { EventsFiltersViewport } from './events-filters-viewport.component';
import {
  EVENT_FACET_CATEGORIES,
  EVENT_FACET_LOCATIONS,
  MAIN_EVENTS_GRID_HITS_PER_PAGE,
  MAIN_EVENTS_TYPE_FILTER,
} from '../all-events.constants';

function formatMobileEventDateParts(isoDate: string) {
  const date = new Date(isoDate);

  return {
    month: date
      .toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
      })
      .toUpperCase(),
    day: date.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      day: 'numeric',
    }),
    weekday: date
      .toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
      })
      .toUpperCase(),
  };
}

function getEventHitLocation(
  hit: ContentItemHit,
  multipleLabel = 'Multiple Locations',
) {
  return hit.eventLocations && hit.eventLocations.length > 1
    ? multipleLabel
    : hit.eventLocations?.[0] ||
        hit.locations?.[0]?.name ||
        'Christ Fellowship Church';
}

function MobileEventHitCard({ hit, to }: { hit: ContentItemHit; to: string }) {
  const dateParts = hit.startDateTime
    ? formatMobileEventDateParts(hit.startDateTime)
    : null;
  const location = getEventHitLocation(hit, 'Multiple campuses');

  return (
    <Link
      to={to}
      className='flex h-[88px] w-full items-start overflow-hidden rounded-xl border border-neutral-lighter bg-white text-text-primary transition-colors duration-200 hover:border-neutral-light md:hidden'
      prefetch='intent'
    >
      <div className='flex h-[88px] w-[74px] shrink-0 flex-col items-center justify-center px-[7px] py-[7px] text-center leading-normal'>
        {dateParts ? (
          <time dateTime={hit.startDateTime} className='block'>
            <span className='block text-xs font-semibold leading-[18px] opacity-70'>
              {dateParts.month}
            </span>
            <span className='block text-2xl font-extrabold leading-9'>
              {dateParts.day}
            </span>
            <span className='block text-xs font-semibold leading-[18px] opacity-70'>
              {dateParts.weekday}
            </span>
          </time>
        ) : null}
      </div>

      <div className='flex h-[88px] min-w-0 flex-1 items-center pr-1'>
        <div className='flex h-full min-w-0 flex-1 flex-col justify-center gap-2 py-2 pl-1 pr-4'>
          <h4 className='line-clamp-2 w-full text-base font-bold leading-[1.4] text-pretty'>
            {hit.title}
          </h4>

          <div className='flex min-w-0 items-center gap-1'>
            <Icon
              name='map'
              color='currentColor'
              size={18}
              className='shrink-0'
            />
            <p className='truncate text-sm font-semibold leading-normal'>
              {location}
            </p>
          </div>
        </div>

        <Icon
          name='chevronRight'
          color='currentColor'
          size={24}
          className='shrink-0 text-neutral-light'
        />
      </div>
    </Link>
  );
}

function EventHit({
  hit,
  fromEventsUrl,
}: {
  hit: ContentItemHit;
  fromEventsUrl: string;
}) {
  const formattedDate = hit.startDateTime
    ? formatEventCardDate(hit.startDateTime)
    : '';

  const imageUri = hit.coverImage?.sources?.[0]?.uri ?? '';
  const location = getEventHitLocation(hit);

  // Forward the active finder filters so the event's back button can restore
  // them (stateless `from` query param — see events-back-url.ts).
  const eventSingleUrl = buildEventSingleUrl(hit.url, fromEventsUrl);

  return (
    <>
      <MobileEventHitCard hit={hit} to={eventSingleUrl} />
      <div className='hidden h-full md:block'>
        <ResourceCard
          resource={{
            id: hit.objectID,
            contentChannelId: '78',
            contentType: 'EVENTS',
            name: hit.title,
            summary: hit.summary ?? '',
            image: imageUri,
            pathname: eventSingleUrl,
            startDate: formattedDate,
            location,
          }}
        />
      </div>
    </>
  );
}

interface PaginationButtonProps {
  children: React.ReactNode;
  isDisabled?: boolean;
  isActive?: boolean;
  href: string;
  onClick: () => void;
  className?: string;
}

const PaginationButton = ({
  children,
  isDisabled = false,
  isActive = false,
  href,
  onClick,
  className = '',
}: PaginationButtonProps) => {
  if (isDisabled) {
    return (
      <span
        className={`${className} inline-flex items-center justify-center border-2 border-neutral-200 text-neutral-200 cursor-not-allowed`}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`${className} inline-flex items-center justify-center border-2 ${
        isActive
          ? 'border-navy bg-navy text-white'
          : 'border-navy text-navy hover:bg-navy hover:text-white'
      } transition-colors duration-200 cursor-pointer`}
    >
      {children}
    </a>
  );
};

function sortEventHitsByStartDateDesc(
  hits: ContentItemHit[],
): ContentItemHit[] {
  return [...hits].sort(
    (a, b) =>
      new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime(),
  );
}

export function AllEventsContent() {
  const {
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    featuredHits,
    mainEventHits,
    eventsNbPages,
    eventsPage,
    algoliaIndexes,
  } = useLoaderData<AllEventsLoaderData>();
  const eventsIndexName = algoliaIndexes.contentItems;
  const {
    InstantSearchUrlSync: AllEventsInstantSearchSync,
    buildUiState: buildAllEventsInstantSearchUiState,
  } = useMemo(
    () =>
      createInstantSearchUrlSync<EventsFinderUrlState>({
        indexName: eventsIndexName,
        parseUrlState: parseEventsFinderUrlState,
      }),
    [eventsIndexName],
  );

  const {
    urlState,
    applyUrlState,
    searchParams,
    clearAllFiltersFromUrl,
    fromEventsUrl,
    eventsMobilePinEndRef,
  } = useEventsAlgoliaRouting();

  const searchClient = useMemo(
    () => algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, {}),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  // Events can be deep-linked with category/location/page params. The loader
  // uses those params for SSR first paint; this passes the same state into
  // InstantSearch when the client widgets mount.
  const initialUiState = useMemo(() => {
    const state = buildAllEventsInstantSearchUiState(urlState);
    return Object.keys(state).length > 0
      ? (state as Record<string, Record<string, unknown>>)
      : undefined;
  }, [buildAllEventsInstantSearchUiState, urlState]);

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseEventsFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const isFirstPage = eventsPage <= 0;
  const isLastPage = eventsNbPages <= 0 || eventsPage >= eventsNbPages - 1;

  const [filtersMounted, setFiltersMounted] = useState(false);
  useEffect(() => {
    setFiltersMounted(true);
  }, []);

  return (
    <>
      <FeaturedEventsSectionLayout>
        <FeaturedEventsFromHits hits={featuredHits} />
      </FeaturedEventsSectionLayout>

      <div className='flex w-full min-w-0 max-w-full flex-col pagination-scroll-to pt-8 pb-24 md:pt-16 md:pb-28'>
        <div className='content-padding'>
          <div className='mx-auto w-full max-w-screen-content'>
            <div className='hidden md:block'>
              <SectionTitle
                title='Discover Events For You'
                sectionTitle='all events'
              />
            </div>

            <div className='md:hidden'>
              <SectionTitle title='Search All Events' />
            </div>
          </div>
        </div>

        {filtersMounted ? (
          <InstantSearch
            indexName={eventsIndexName}
            searchClient={searchClient}
            initialUiState={initialUiState}
            onStateChange={({ uiState, setUiState }) => {
              setUiState(uiState);
              const indexState = uiState[eventsIndexName];
              if (!indexState) return;
              const index = indexState as Record<string, unknown>;

              // Keep the existing events URL contract (`q`, `p`,
              // `eventCategories`, `eventLocations`) rather than exposing
              // InstantSearch's default routing shape.
              applyUrlState({
                query:
                  typeof index.query === 'string' &&
                  index.query.trim().length > 0
                    ? index.query
                    : undefined,
                refinementList:
                  (index.refinementList as Record<string, string[]>) ??
                  undefined,
                page:
                  typeof index.page === 'number' && index.page > 0
                    ? index.page
                    : undefined,
              });
            }}
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <AllEventsInstantSearchSync />
            <Configure
              filters={MAIN_EVENTS_TYPE_FILTER}
              hitsPerPage={MAIN_EVENTS_GRID_HITS_PER_PAGE}
            />
            <AllEventsInstantFilters
              eventsMobilePinEndRef={eventsMobilePinEndRef}
              buildAllEventsInstantSearchUiState={
                buildAllEventsInstantSearchUiState
              }
            />
            <AllEventsInstantResults
              initialEventHits={mainEventHits}
              fromEventsUrl={fromEventsUrl}
            />
          </InstantSearch>
        ) : (
          <>
            {/* Before hydration, show the loader-backed grid and the events
                filter skeleton. The real filter facet values come from
                `useRefinementList` after InstantSearch mounts. */}
            <EventsFiltersViewport
              onClearAllToUrl={clearAllFiltersFromUrl}
              eventsMobilePinEndRef={eventsMobilePinEndRef}
              urlState={urlState}
              applyUrlState={applyUrlState}
              categoryFacets={[]}
              locationFacets={[]}
            />
            <AllEventsResultsLayout
              eventHits={mainEventHits}
              eventsNbPages={eventsNbPages}
              eventsPage={eventsPage}
              isFirstPage={isFirstPage}
              isLastPage={isLastPage}
              isLoading={false}
              fromEventsUrl={fromEventsUrl}
              goToPage={(nextPage) => {
                applyUrlState({
                  ...urlState,
                  page: Math.max(0, nextPage),
                });
                const scrollTarget = document.querySelector(
                  '.pagination-scroll-to',
                );
                if (scrollTarget) {
                  scrollTarget.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              eventsMobilePinEndRef={eventsMobilePinEndRef}
            />
          </>
        )}
      </div>
    </>
  );
}

function mapRefinementItemsToFacets(
  items: ReturnType<typeof useRefinementList>['items'],
): EventFinderFacetItem[] {
  // Existing events filter components are presentational and expect loader-like
  // facet objects. Map InstantSearch refinement items into that same shape so
  // desktop and mobile UI can stay unchanged.
  return items.map((item) => ({
    value: item.value,
    label: item.label,
    count: item.count,
  }));
}

function AllEventsInstantFilters({
  eventsMobilePinEndRef,
  buildAllEventsInstantSearchUiState,
}: Pick<Parameters<typeof EventsFiltersViewport>[0], 'eventsMobilePinEndRef'> & {
  buildAllEventsInstantSearchUiState: (
    urlState: EventsFinderUrlState,
  ) => Record<string, Record<string, unknown>>;
}) {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const categoryItems = useRefinementList({
    attribute: EVENT_FACET_CATEGORIES,
    limit: 50,
  });
  const locationItems = useRefinementList({
    attribute: EVENT_FACET_LOCATIONS,
    limit: 50,
  });

  // Events filter components still work with URL-shaped state because that is
  // also what the active-chip and clear-all UI understand. Here the source of
  // truth is InstantSearch's index state, converted into the same shape.
  const urlState = {
    query:
      typeof indexUiState.query === 'string' &&
      indexUiState.query.trim().length > 0
        ? indexUiState.query
        : undefined,
    refinementList:
      (indexUiState.refinementList as Record<string, string[]>) ?? undefined,
    page:
      typeof indexUiState.page === 'number' && indexUiState.page > 0
        ? indexUiState.page
        : undefined,
  } satisfies EventsFinderUrlState;

  const applyUrlState = (next: EventsFinderUrlState) => {
    // Convert the events UI's URL-shaped update back into InstantSearch state.
    // The parent `onStateChange` then writes the canonical URL, so filter clicks
    // remain client-side without invoking the route loader.
    const nextState = buildAllEventsInstantSearchUiState(next);
    const nextUiState = Object.values(nextState)[0];
    setIndexUiState((nextUiState ?? {}) as Record<string, unknown>);
  };

  return (
    <EventsFiltersViewport
      onClearAllToUrl={() => setIndexUiState({})}
      eventsMobilePinEndRef={eventsMobilePinEndRef}
      urlState={urlState}
      applyUrlState={applyUrlState}
      categoryFacets={mapRefinementItemsToFacets(categoryItems.items)}
      locationFacets={mapRefinementItemsToFacets(locationItems.items)}
    />
  );
}

function AllEventsInstantResults({
  initialEventHits,
  fromEventsUrl,
}: {
  initialEventHits: ContentItemHit[];
  fromEventsUrl: string;
}) {
  const { hits, isLoading } = useHydratedHitsFallback<ContentItemHit>({
    initialHits: initialEventHits,
  });
  const { currentRefinement, nbPages, isFirstPage, isLastPage, refine } =
    usePagination();

  // The index response is sorted by Algolia ranking; events still need the
  // existing date-desc presentation order used by the loader-backed first paint.
  const eventHits = sortEventHitsByStartDateDesc(hits);

  return (
    <AllEventsResultsLayout
      eventHits={eventHits}
      eventsNbPages={nbPages}
      eventsPage={currentRefinement}
      isFirstPage={isFirstPage}
      isLastPage={isLastPage}
      isLoading={isLoading}
      fromEventsUrl={fromEventsUrl}
      goToPage={(nextPage) => {
        // Let InstantSearch own pagination after hydration; the route URL is
        // synchronized by `onStateChange` above.
        refine(Math.max(0, nextPage));
        window.requestAnimationFrame(() => {
          const scrollTarget = document.querySelector('.pagination-scroll-to');
          scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }}
    />
  );
}

function AllEventsResultsLayout({
  eventHits,
  eventsNbPages,
  eventsPage,
  isFirstPage,
  isLastPage,
  isLoading,
  fromEventsUrl,
  goToPage,
  eventsMobilePinEndRef,
}: {
  eventHits: ContentItemHit[];
  eventsNbPages: number;
  eventsPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  isLoading: boolean;
  fromEventsUrl: string;
  goToPage: (nextPage: number) => void;
  eventsMobilePinEndRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className='content-padding pt-16 md:pt-0'>
      <div className='mx-auto min-h-88 w-full max-w-screen-content md:min-h-112'>
        {eventHits.length === 0 && !isLoading ? null : (
          <ul
            className={cn(
              'grid w-full list-none grid-cols-1 justify-items-center gap-4 p-0 md:grid-cols-2 md:gap-10 lg:grid-cols-3',
              isLoading && 'opacity-60 pointer-events-none',
            )}
            role='list'
          >
            {eventHits.map((hit) => (
              <li key={hit.objectID} className='w-full'>
                <EventHit hit={hit} fromEventsUrl={fromEventsUrl} />
              </li>
            ))}
          </ul>
        )}

        {eventsNbPages > 1 ? (
          <div className='flex items-center justify-start gap-4 mt-16'>
            <PaginationButton
              isDisabled={isFirstPage}
              onClick={() => goToPage(eventsPage - 1)}
              href='#'
              className='w-12 h-12'
            >
              <Icon name='chevronLeft' size={24} />
            </PaginationButton>

            <PaginationButton
              isActive
              onClick={() => {}}
              href='#'
              className='w-12 h-12 bg-navy text-white'
            >
              {eventsPage + 1}
            </PaginationButton>

            <PaginationButton
              isDisabled={isLastPage}
              onClick={() => goToPage(eventsPage + 1)}
              href='#'
              className='w-12 h-12'
            >
              <Icon name='chevronRight' size={24} />
            </PaginationButton>
          </div>
        ) : null}

        <div
          ref={eventsMobilePinEndRef}
          className='pointer-events-none h-0 w-full shrink-0'
          aria-hidden
        />
      </div>
    </div>
  );
}
