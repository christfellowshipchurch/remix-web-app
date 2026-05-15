import { useLoaderData, useLocation, useNavigation } from 'react-router-dom';
import { cn } from '~/lib/utils';

import { SectionTitle } from '~/components';
import { Icon } from '~/primitives/icon/icon';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';
import { ResourceCard } from '~/primitives/cards/resource-card';
import type { ContentItemHit } from '~/routes/search/types';

import type { AllEventsLoaderData } from '../loader';
import { useEventsAlgoliaRouting } from '../hooks/use-events-algolia-routing.hook';
import {
  FeaturedEventsFromHits,
  FeaturedEventsSectionLayout,
} from '../partials/featured-events.partial';
import { parseEventsFinderUrlState } from '../../events-url-state';

import { formatEventCardDate } from './featured-card.component';
import { EventsFiltersViewport } from './events-filters-viewport.component';

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

  return (
    <ResourceCard
      resource={{
        id: hit.objectID,
        contentChannelId: '78',
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
}

export function AllEventsContent() {
  const {
    featuredHits,
    mainEventHits,
    eventCategoryFacets,
    eventLocationFacets,
    eventsNbPages,
    eventsPage,
  } = useLoaderData<AllEventsLoaderData>();

  const {
    urlState,
    applyUrlState,
    searchParams,
    clearAllFiltersFromUrl,
    fromEventsUrl,
    eventsMobilePinEndRef,
  } = useEventsAlgoliaRouting();

  const navigation = useNavigation();
  const location = useLocation();
  const isLoading =
    navigation.state === 'loading' &&
    navigation.location?.pathname === location.pathname;

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseEventsFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const goToPage = (nextPage: number) => {
    applyUrlState({
      ...urlState,
      page: Math.max(0, nextPage),
    });
    const scrollTarget = document.querySelector('.pagination-scroll-to');
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFirstPage = eventsPage <= 0;
  const isLastPage = eventsNbPages <= 0 || eventsPage >= eventsNbPages - 1;

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
          urlState={urlState}
          applyUrlState={applyUrlState}
          categoryFacets={eventCategoryFacets}
          locationFacets={eventLocationFacets}
        />

        <div className='content-padding pt-16 md:pt-0'>
          <div className='mx-auto min-h-[22rem] w-full max-w-screen-content md:min-h-[28rem]'>
            {mainEventHits.length === 0 && !isLoading ? null : (
              <ul
                className={cn(
                  'grid w-full list-none grid-cols-1 justify-items-center gap-10 p-0 md:grid-cols-2 lg:grid-cols-3',
                  isLoading && 'opacity-60 pointer-events-none',
                )}
                role='list'
              >
                {mainEventHits.map((hit) => (
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
      </div>
    </>
  );
}
