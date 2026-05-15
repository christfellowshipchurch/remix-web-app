import { useLoaderData } from 'react-router-dom';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch';

import { SectionTitle } from '~/components';
import { CustomPagination } from '~/components/custom-pagination';
import { createSearchClient } from '~/lib/create-search-client';
import { ResourceCard } from '~/primitives/cards/resource-card';
import { ContentItemHit } from '~/routes/search/types';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';

import type { AllEventsLoaderData } from '../loader';
import { formatEventCardDate } from './featured-card.component';
import { useEventsAlgoliaRouting } from '../hooks/use-events-algolia-routing.hook';
import {
  FeaturedEventsFromHits,
  FeaturedEventsSectionLayout,
} from '../partials/featured-events.partial';
import { parseEventsFinderUrlState } from '../../events-url-state';

import { EventsFiltersViewport } from './events-filters-viewport.component';
import {
  EVENTS_INDEX,
  MAIN_EVENTS_GRID_HITS_PER_PAGE,
  MAIN_EVENTS_TYPE_FILTER,
} from './events-tags-refinement.component';

const EventHit = ({
  hit,
  fromEventsUrl,
}: {
  hit: ContentItemHit;
  fromEventsUrl: string;
}) => {
  const formattedDate = hit.startDateTime
    ? formatEventCardDate(hit.startDateTime)
    : '';

  const imageUri = hit.coverImage?.sources?.[0]?.uri ?? '';

  return (
    <ResourceCard
      resource={{
        id: hit.objectID,
        contentChannelId: '78', // EVENT type from builder-utils.ts
        contentType: 'EVENTS',
        name: hit.title,
        summary: hit.summary ?? '',
        image: imageUri,
        pathname: `/events/${hit.url}`,
        startDate: formattedDate,
        location:
          hit.eventLocations && hit.eventLocations.length > 1
            ? 'Multiple Locations'
            : hit.eventLocations?.[0] ||
              hit.locations?.[0]?.name ||
              'Christ Fellowship Church',
      }}
      linkState={fromEventsUrl ? { fromEvents: fromEventsUrl } : undefined}
    />
  );
};

function MainEventsGridFromLoader({
  hits,
  fromEventsUrl,
}: {
  hits: ContentItemHit[];
  fromEventsUrl: string;
}) {
  if (hits.length === 0) {
    return null;
  }

  return (
    <ul
      className='grid w-full list-none grid-cols-1 justify-items-center gap-10 p-0 md:grid-cols-2 lg:grid-cols-3'
      role='list'
    >
      {hits.map((hit) => (
        <li key={hit.objectID} className='w-full'>
          <EventHit hit={hit} fromEventsUrl={fromEventsUrl} />
        </li>
      ))}
    </ul>
  );
}

export function AllEventsInstantSearchShell() {
  const {
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    featuredHits,
    initialEventHits,
  } = useLoaderData<AllEventsLoaderData>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  const {
    routing,
    searchParams,
    clearAllFiltersFromUrl,
    fromEventsUrl,
    eventsMobilePinEndRef,
  } = useEventsAlgoliaRouting();

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseEventsFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  return (
    <>
      <FeaturedEventsSectionLayout>
        <FeaturedEventsFromHits hits={featuredHits} />
      </FeaturedEventsSectionLayout>

      <InstantSearch
        indexName={EVENTS_INDEX}
        searchClient={searchClient}
        routing={routing}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure
          filters={MAIN_EVENTS_TYPE_FILTER}
          hitsPerPage={MAIN_EVENTS_GRID_HITS_PER_PAGE}
        />

        <div className='flex w-full min-w-0 max-w-full flex-col pagination-scroll-to pt-8 pb-24 md:pt-16 md:pb-28'>
          <div className='content-padding'>
            <div className='mx-auto w-full max-w-screen-content'>
              <div className='hidden md:block'>
                <SectionTitle
                  title='Discover Events For You'
                  sectionTitle='all events.'
                />
              </div>

              <div className='md:hidden'>
                <SectionTitle title='Search All Events' />
              </div>
            </div>
          </div>

          <EventsFiltersViewport
            onClearAllToUrl={clearAllFiltersFromUrl}
            eventsMobilePinEndRef={eventsMobilePinEndRef}
          />

          <div className='content-padding pt-16 md:pt-0'>
            <div className='mx-auto min-h-[22rem] w-full max-w-screen-content md:min-h-[28rem]'>
              <MainEventsGridFromLoader
                hits={initialEventHits}
                fromEventsUrl={fromEventsUrl}
              />

              <CustomPagination />

              <div
                ref={eventsMobilePinEndRef}
                className='pointer-events-none h-0 w-full shrink-0'
                aria-hidden
              />
            </div>
          </div>
        </div>
      </InstantSearch>
    </>
  );
}
