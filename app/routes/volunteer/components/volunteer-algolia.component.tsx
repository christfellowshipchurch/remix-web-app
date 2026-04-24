import { useEffect, useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
  useRefinementList,
} from "react-instantsearch";

import { FinderStickyBar } from "~/components/finders/finder-sticky-bar.component";
import { ActiveFilters } from "~/components/finders/search-filters/active-filter.component";
import { SearchFilters } from "~/components/finders/search-filters";
import { HubsTagsRefinementList } from "~/components/hubs-tags-refinement";
import { cn } from "~/lib/utils";
import { createSearchClient } from "~/lib/create-search-client";
import { AlgoliaFinderClearAllButton } from "~/routes/group-finder/components/clear-all-button.component";
import { Icon } from "~/primitives/icon/icon";
import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";

import { VolunteerCard } from "./volunteer-card.component";
import type { Volunteer } from "../types";
import { VOLUNTEER_ALGOLIA_INDEX } from "../types";
import {
  parseVolunteerAlgoliaUrlState,
  type VolunteerAlgoliaUrlState,
} from "./finder/volunteer-algolia-url-state";
import {
  createVolunteerAlgoliaInstantSearchRouter,
  createVolunteerAlgoliaStateMapping,
} from "./finder/volunteer-algolia-instantsearch-router";
import { getVolunteerAlgoliaMobileFilters } from "./finder/volunteer-algolia-filters.data";

/** Algolia facet attribute names — align with volunteer index settings. */
const FACET_CATEGORY = "category";
const FACET_CAMPUS = "campusList";

const volunteerCategoryPillBase =
  "inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors";

const volunteerCategoryUnselected = cn(
  volunteerCategoryPillBase,
  "cursor-pointer border border-transparent bg-white text-neutral-darker hover:bg-ocean/10 hover:text-ocean",
);

const volunteerCategorySelected = cn(
  volunteerCategoryPillBase,
  "cursor-default gap-1 bg-ocean/10 text-ocean hover:bg-ocean/10",
);

const volunteerCategoryRemove = cn(
  "shrink-0 cursor-pointer rounded-full p-0.5 text-ocean transition-colors hover:bg-ocean/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-1",
);

/** Notifies parent once when InstantSearch reports `idle` (first response settled). */
function VolunteerSearchReadyReporter({ onReady }: { onReady?: () => void }) {
  const { status } = useInstantSearch();
  const onReadyLatest = useRef(onReady);
  onReadyLatest.current = onReady;
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || status !== "idle") return;
    fired.current = true;
    onReadyLatest.current?.();
  }, [status]);

  return null;
}

function VolunteerHitsCarousel() {
  const { items: hits } = useHits<Volunteer>();

  if (hits.length === 0) {
    return (
      <p className="text-neutral-default content-padding py-8 text-center text-lg 2xl:px-0">
        No volunteer opportunities match your filters right now. Try clearing a
        filter or check back soon.
      </p>
    );
  }

  return (
    <div className="pr-0! md:pr-12 lg:pr-18 2xl:pr-0!">
      <Carousel
        opts={{ align: "start" }}
        className="mt-3 min-w-0 max-w-[1280px] mx-auto"
      >
        <CarouselContent className="items-stretch gap-6 py-6">
          {hits.map((hit, index) => (
            <CarouselItem
              key={hit.objectID}
              className={cn(
                "flex min-h-0 w-full min-w-0 basis-[85vw] flex-col pl-0 sm:basis-[45%] md:basis-[40%] lg:basis-[32%]",
                index === hits.length - 1 && "mr-5 md:mr-12 lg:mr-18 2xl:mr-0!", // Last item
                index === 0 && "ml-5 md:ml-12 lg:ml-18 2xl:ml-0!", // First item
              )}
            >
              <VolunteerCard
                volunteer={hit}
                className="h-full w-full min-w-0"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="relative flex items-center justify-between mt-4 md:mt-8 min-h-[4.5rem] pb-14 sm:pb-16 md:min-h-0 md:pb-8 pl-5 md:pl-12 lg:pl-18 2xl:pl-0!">
          <div className="hidden md:block">
            <CarouselDots
              activeClassName="bg-ocean"
              inactiveClassName="bg-neutral-lighter"
            />
          </div>

          <CarouselArrows arrowStyles="text-ocean border-ocean hover:text-navy hover:border-navy" />
        </div>
      </Carousel>
    </div>
  );
}

function CampusFilterSelect() {
  const { items, refine } = useRefinementList({
    attribute: FACET_CAMPUS,
    limit: 50,
  });

  const value = items.find((i) => i.isRefined)?.value ?? "";
  const hasCampusSelected = Boolean(value);

  return (
    <div className="relative w-fit shrink-0">
      <Icon
        name="map"
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 z-1 -translate-y-1/2 bottom-[8px] transition-colors",
          hasCampusSelected ? "text-ocean" : "text-neutral-default",
        )}
        size={16}
      />
      <select
        aria-label="Filter by location"
        className={cn(
          "w-fit appearance-none rounded-[8px] border py-2.5 pl-9 pr-6 text-sm font-semibold focus:outline-none focus:ring-0 cursor-pointer transition-all duration-300",
          hasCampusSelected
            ? "border-ocean bg-ocean/5 text-ocean hover:border-ocean"
            : "border-[#DEE0E3] bg-white text-neutral-default hover:border-neutral-default",
        )}
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          items.filter((i) => i.isRefined).forEach((i) => refine(i.value));
          if (next) refine(next);
        }}
      >
        <option value="">Filter By Location</option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        className={cn(
          "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-colors",
          hasCampusSelected ? "text-ocean" : "text-neutral-default",
        )}
        size={20}
      />
    </div>
  );
}

export function VolunteerAlgolia({
  appId,
  apiKey,
  onVolunteerUiReady,
}: {
  appId: string;
  apiKey: string;
  /** Called once when credentials are missing, or when the first Algolia search reaches `idle`. */
  onVolunteerUiReady?: () => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const searchParamsRef = useRef(searchParams);
  const setSearchParamsRef = useRef(setSearchParams);
  const pathnameRef = useRef(location.pathname);
  const onUpdateCallbackRef = useRef<
    ((route: VolunteerAlgoliaUrlState) => void) | null
  >(null);

  searchParamsRef.current = searchParams;
  setSearchParamsRef.current = setSearchParams;
  pathnameRef.current = location.pathname;

  const router = useMemo(
    () =>
      createVolunteerAlgoliaInstantSearchRouter({
        searchParamsRef,
        setSearchParamsRef,
        pathnameRef,
        onUpdateCallbackRef,
      }),
    [],
  );

  const stateMapping = useMemo(() => createVolunteerAlgoliaStateMapping(), []);

  useEffect(() => {
    const cb = onUpdateCallbackRef.current;
    if (cb) cb(parseVolunteerAlgoliaUrlState(searchParams));
  }, [searchParams]);

  const routing = useMemo(
    () => ({
      router,
      stateMapping,
    }),
    [router, stateMapping],
  );

  const searchClient = useMemo(
    () => createSearchClient(appId, apiKey),
    [appId, apiKey],
  );

  const canSearch = Boolean(appId && apiKey);
  const desktopFilters = useMemo(() => getVolunteerAlgoliaMobileFilters(), []);
  const onReadyRef = useRef(onVolunteerUiReady);
  onReadyRef.current = onVolunteerUiReady;

  useEffect(() => {
    if (canSearch) return;
    onReadyRef.current?.();
  }, [canSearch]);

  if (!canSearch) {
    return (
      <p className="text-neutral-default content-padding text-center 2xl:px-0">
        Volunteer search is unavailable. Algolia credentials are not configured
        for this environment.
      </p>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={VOLUNTEER_ALGOLIA_INDEX}
      routing={routing}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <VolunteerSearchReadyReporter onReady={onVolunteerUiReady} />
      <Configure hitsPerPage={12} />

      {/* Mobile: sticky strip + bottom-sheet filter popups (parent must be `md:hidden` only here) */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex w-full min-w-0 max-w-[100vw] flex-col">
          <FinderStickyBar>
            <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 py-4">
              <SearchFilters
                onClearAllToUrl={() => {}}
                desktopFilters={desktopFilters}
                compactInlineFilterCount={2}
              />
            </div>
            <ActiveFilters />
          </FinderStickyBar>
        </div>
      </div>

      {/* Desktop: inline category pills + clear + campus */}
      <div className="content-padding">
        <div className="mx-auto hidden max-w-[1280px] flex-col gap-3 md:flex md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <HubsTagsRefinementList
              attribute={FACET_CATEGORY}
              wrapperClass="flex min-w-0 flex-1 flex-wrap gap-2 md:gap-4 px-1 pb-4 md:pb-0 overflow-x-auto scrollbar-hide"
              unselectedClassName={volunteerCategoryUnselected}
              selectedClassName={volunteerCategorySelected}
              removeButtonClassName={volunteerCategoryRemove}
            />
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 md:ml-auto">
            <AlgoliaFinderClearAllButton />
            <CampusFilterSelect />
          </div>
        </div>
      </div>

      <VolunteerHitsCarousel />
    </InstantSearch>
  );
}
