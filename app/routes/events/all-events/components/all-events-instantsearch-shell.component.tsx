import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { createSearchClient } from '~/lib/create-search-client';

import type { AllEventsLoaderData } from '../loader';
import { AllEventsAlgoliaTree } from './all-events-algolia-tree.component';
import { useEventsAlgoliaRouting } from '../hooks/use-events-algolia-routing.hook';

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

  return (
    <AllEventsAlgoliaTree
      searchClient={searchClient}
      routing={routing}
      searchParams={searchParams}
      fromEventsUrl={fromEventsUrl}
      onClearAllToUrl={clearAllFiltersFromUrl}
      eventsMobilePinEndRef={eventsMobilePinEndRef}
      featuredHits={featuredHits}
      initialEventHits={initialEventHits}
    />
  );
}
