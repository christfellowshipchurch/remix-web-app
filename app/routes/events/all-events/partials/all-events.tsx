import { useLoaderData, useSearchParams, useLocation } from "react-router-dom";
import { EventReturnType } from "../loader";
import { SectionTitle } from "~/components";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { Configure, Hits, InstantSearch } from "react-instantsearch";
import { useEffect, useMemo, useRef } from "react";
import { ContentItemHit } from "~/routes/search/types";
import { EVENTS_INDEX } from "../components/events-tags-refinement.component";
import { CustomPagination } from "~/components/custom-pagination";
import { createSearchClient } from "~/lib/create-search-client";
import { EventsFiltersViewport } from "../components/events-filters-viewport.component";
import {
  parseEventsFinderUrlState,
  eventsFinderUrlStateToParams,
  eventsFinderEmptyState,
} from "../../events-url-state";
import {
  createEventsInstantSearchRouter,
  createEventsStateMapping,
} from "../../events-instantsearch-router";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";

export const AllEvents = () => {
  const loaderData = useLoaderData<EventReturnType>();
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = loaderData ?? {};
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

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  const routing = useMemo(
    () => ({
      router,
      stateMapping,
    }),
    [router, stateMapping],
  );

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseEventsFinderUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const fromEventsUrl =
    location.pathname +
    (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const eventsMobilePinEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col pagination-scroll-to pt-8 pb-24 md:pt-16 md:pb-28">
      <InstantSearch
        indexName={EVENTS_INDEX}
        searchClient={searchClient}
        routing={routing}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure filters='contentType:"Event"' hitsPerPage={9} />

        <div className="content-padding">
          <div className="mx-auto w-full max-w-screen-content">
            {/* Desktop */}
            <div className="hidden md:block">
              <SectionTitle
                title="Discover Events For You"
                sectionTitle="all events."
              />
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <SectionTitle title="Search All Events" />
            </div>
          </div>
        </div>

        <EventsFiltersViewport
          onClearAllToUrl={clearAllFiltersFromUrl}
          eventsMobilePinEndRef={eventsMobilePinEndRef}
        />

        <div className="content-padding pt-16 md:pt-0">
          <div className="mx-auto w-full max-w-screen-content">
            <Hits
              hitComponent={({ hit }: { hit: ContentItemHit }) => {
                return <EventHit hit={hit} fromEventsUrl={fromEventsUrl} />;
              }}
              transformItems={(items) =>
                [...items].sort(
                  (a, b) =>
                    new Date(b.startDateTime).getTime() -
                    new Date(a.startDateTime).getTime(),
                )
              }
              classNames={{
                list: "grid w-full grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3",
                item: "w-full",
              }}
            />

            <CustomPagination />

            <div
              ref={eventsMobilePinEndRef}
              className="pointer-events-none h-0 w-full shrink-0"
              aria-hidden
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

const EventHit = ({
  hit,
  fromEventsUrl,
}: {
  hit: ContentItemHit;
  fromEventsUrl: string;
}) => {
  const formattedDate = new Date(hit.startDateTime).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <ResourceCard
      resource={{
        id: hit.objectID,
        contentChannelId: "78", // EVENT type from builder-utils.ts
        contentType: "EVENTS",
        name: hit.title,
        summary: hit.summary,
        image: hit.coverImage.sources[0].uri,
        pathname: `/events/${hit.url}`,
        startDate: formattedDate,
        location:
          hit.eventLocations && hit.eventLocations.length > 1
            ? "Multiple Locations"
            : hit.eventLocations?.[0] ||
              hit.locations?.[0]?.name ||
              "Christ Fellowship Church",
      }}
      linkState={fromEventsUrl ? { fromEvents: fromEventsUrl } : undefined}
    />
  );
};
