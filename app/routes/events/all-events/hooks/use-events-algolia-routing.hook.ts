import { useCallback, useMemo, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import {
  eventsFinderEmptyState,
  eventsFinderUrlStateToParams,
  parseEventsFinderUrlState,
} from '../../events-url-state';
import type { EventsFinderUrlState } from '../../events-url-state';

export function useEventsAlgoliaRouting() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const eventsMobilePinEndRef = useRef<HTMLDivElement>(null);

  const urlState = useMemo(
    () => parseEventsFinderUrlState(searchParams),
    [searchParams],
  );

  const applyUrlState = useCallback(
    (next: EventsFinderUrlState) => {
      setSearchParams(eventsFinderUrlStateToParams(next), {
        replace: true,
        preventScrollReset: true,
      });
    },
    [setSearchParams],
  );

  const clearAllFiltersFromUrl = () => {
    setSearchParams(eventsFinderUrlStateToParams(eventsFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
  };

  const fromEventsUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : '');

  return {
    urlState,
    applyUrlState,
    searchParams,
    clearAllFiltersFromUrl,
    fromEventsUrl,
    eventsMobilePinEndRef,
  };
}
