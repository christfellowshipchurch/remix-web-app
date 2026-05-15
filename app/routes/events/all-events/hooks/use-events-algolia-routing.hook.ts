import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, type ComponentProps } from 'react';
import { InstantSearch } from 'react-instantsearch';

import {
  parseEventsFinderUrlState,
  eventsFinderUrlStateToParams,
  eventsFinderEmptyState,
} from '../../events-url-state';
import {
  createEventsInstantSearchRouter,
  createEventsStateMapping,
} from '../../events-instantsearch-router';

type InstantSearchRouting = NonNullable<
  ComponentProps<typeof InstantSearch>['routing']
>;

export function useEventsAlgoliaRouting() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const searchParamsRef = useRef(searchParams);
  const setSearchParamsRef = useRef(setSearchParams);
  const pathnameRef = useRef(location.pathname);
  const onUpdateCallbackRef = useRef<
    ((route: ReturnType<typeof parseEventsFinderUrlState>) => void) | null
  >(null);

  searchParamsRef.current = searchParams;
  setSearchParamsRef.current = setSearchParams;
  pathnameRef.current = location.pathname;

  const router = useMemo(
    () =>
      createEventsInstantSearchRouter({
        searchParamsRef,
        setSearchParamsRef,
        pathnameRef,
        onUpdateCallbackRef,
      }),
    [],
  );

  const stateMapping = useMemo(() => createEventsStateMapping(), []);

  useEffect(() => {
    const cb = onUpdateCallbackRef.current;
    if (cb) cb(parseEventsFinderUrlState(searchParams));
  }, [searchParams]);

  const clearAllFiltersFromUrl = () => {
    setSearchParams(eventsFinderUrlStateToParams(eventsFinderEmptyState), {
      replace: true,
      preventScrollReset: true,
    });
  };

  const routing = useMemo(
    () =>
      ({
        router,
        stateMapping,
      }) as InstantSearchRouting,
    [router, stateMapping],
  );

  const fromEventsUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : '');

  const eventsMobilePinEndRef = useRef<HTMLDivElement>(null);

  return {
    routing,
    searchParams,
    clearAllFiltersFromUrl,
    fromEventsUrl,
    eventsMobilePinEndRef,
  };
}
