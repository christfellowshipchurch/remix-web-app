import { useInstantSearch, useRefinementList } from 'react-instantsearch';

import type { EventFinderFacetItem } from '../loader';
import type { EventsFinderUrlState } from '../../events-url-state';
import {
  EVENT_FACET_CATEGORIES,
  EVENT_FACET_LOCATIONS,
} from '../all-events.constants';
import { EventsFiltersViewport } from './events-filters-viewport.component';

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

export function AllEventsInstantFilters({
  eventsMobilePinEndRef,
  buildAllEventsInstantSearchUiState,
}: Pick<
  Parameters<typeof EventsFiltersViewport>[0],
  'eventsMobilePinEndRef'
> & {
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
