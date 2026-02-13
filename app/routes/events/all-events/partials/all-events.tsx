import { useLoaderData, useSearchParams, useLocation } from "react-router-dom";
import { EventReturnType } from "../loader";
import { SectionTitle } from "~/components";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { Configure, Hits, InstantSearch } from "react-instantsearch";
import { useEffect, useMemo, useRef } from "react";
import { ContentItemHit } from "~/routes/search/types";
import {
  EVENTS_INDEX,
  EventsTagsRefinementList,
} from "../components/events-tags-refinement.component";
import { CustomPagination } from "~/components/custom-pagination";
import { createSearchClient } from "~/lib/create-search-client";
import { EventsHubLocationSearch } from "../components/events-hub-location-search.component";
import {
  parseEventsFinderUrlState,
  eventsFinderUrlStateToParams,
  eventsFinderEmptyState,
} from "../../events-url-state";
import {
  createEventsInstantSearchRouter,
  createEventsStateMapping,
} from "../../events-instantsearch-router";
import { AlgoliaFinderClearAllButton } from "~/routes/group-finder/components/clear-all-button.component";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";

export const AllEvents = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<EventReturnType>();
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
    []
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
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  const routing = useMemo(
    () => ({
      router,
      stateMapping,
    }),
    [router, stateMapping]
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

  return (
    <div className="w-full pt-16 pb-28 content-padding pagination-scroll-to">
      <div className="flex flex-col max-w-screen-content mx-auto">
        <InstantSearch
          indexName={EVENTS_INDEX}
          searchClient={searchClient}
          routing={routing}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <div className="flex items-end justify-between gap-4">
            <SectionTitle
              title="Discover Events For You"
              sectionTitle="all events."
            />

            <AlgoliaFinderClearAllButton
              onClearAllToUrl={clearAllFiltersFromUrl}
            />
          </div>

          <Configure filters='contentType:"Event"' hitsPerPage={9} />

          {/* Filters */}
          <div className="flex gap-6 flex-col md:flex-row md:flex-nowrap px-1 pb-4 overflow-y-visible mt-10 mb-12 md:mt-14 lg:mb-24 xl:mb-28">
            {/* Location Search */}
            <EventsHubLocationSearch />

            <EventsTagsRefinementList />
          </div>

          <Hits
            hitComponent={({ hit }: { hit: ContentItemHit }) => {
              return <EventHit hit={hit} fromEventsUrl={fromEventsUrl} />;
            }}
            transformItems={(items) =>
              [...items].sort(
                (a, b) =>
                  new Date(b.startDateTime).getTime() -
                  new Date(a.startDateTime).getTime()
              )
            }
            classNames={{
              list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center",
              item: "w-full",
            }}
          />

          <CustomPagination />
        </InstantSearch>
      </div>
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
    }
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
