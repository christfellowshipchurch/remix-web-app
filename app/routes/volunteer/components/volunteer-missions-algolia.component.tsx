import { useEffect, useMemo, useRef } from "react";
import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
  useMenu,
  useRefinementList,
} from "react-instantsearch";

import { cn } from "~/lib/utils";
import { createSearchClient } from "~/lib/create-search-client";
import { Icon } from "~/primitives/icon/icon";
import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";

import { MissionCard } from "./mission-card.component";
import type { Mission } from "../mission.types";
import { VOLUNTEER_MISSIONS_ALGOLIA_INDEX } from "../mission.types";

/** Algolia facet attribute names — align with `dev_missionsFinder` index settings. */
const FACET_CATEGORY = "category";
const FACET_LOCATION_CITY = "location.city";

/** Notifies parent once when InstantSearch reports `idle` (first response settled). */
function MissionSearchReadyReporter({ onReady }: { onReady?: () => void }) {
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

function MissionHitsCarousel() {
  const { items: hits } = useHits<Mission>();

  if (hits.length === 0) {
    return (
      <p className="text-neutral-default content-padding py-8 text-center text-lg 2xl:px-0">
        No missions match your filters right now. Try clearing a filter or check
        back soon.
      </p>
    );
  }

  return (
    <Carousel
      opts={{ align: "start" }}
      className="mt-3 min-w-0 max-w-full pl-5 md:pl-12 lg:pl-18 2xl:pl-0!"
    >
      <CarouselContent className="items-stretch gap-6 pt-4">
        {hits.map((hit, index) => (
          <CarouselItem
            key={hit.objectID}
            className={cn(
              "flex min-h-0 w-full min-w-0 basis-[85vw] flex-col pl-0 sm:basis-[45%] md:basis-[40%] lg:basis-[33.33%]",
              index === hits.length - 1 && "mr-5 md:mr-12 lg:mr-18",
            )}
          >
            <MissionCard mission={hit} className="h-full w-full min-w-0" />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="relative flex items-center justify-between mt-8 min-h-[4.5rem] pb-14 sm:mt-12 sm:pb-16 md:min-h-0 md:pb-8">
        <CarouselDots
          activeClassName="bg-ocean"
          inactiveClassName="bg-neutral-lighter"
        />

        <div className="pr-5 md:pr-12 lg:pr-18 2xl:pr-0">
          <CarouselArrows arrowStyles="text-ocean border-ocean hover:text-navy hover:border-navy" />
        </div>
      </div>
    </Carousel>
  );
}

function CategoryFilterPills() {
  const { items, refine } = useRefinementList({
    attribute: FACET_CATEGORY,
    limit: 24,
    sortBy: ["name:asc"],
  });

  if (!items.length) return null;

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = item.isRefined;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => refine(item.value)}
            className={cn(
              "inline-flex max-w-full items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active
                ? "bg-ocean/10 text-ocean"
                : "bg-white text-neutral-darker hover:bg-ocean/10 hover:text-ocean",
            )}
          >
            <span className="truncate">{item.label}</span>
            {active ? (
              <Icon name="x" size={14} className="shrink-0 text-ocean" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function LocationFilterSelect() {
  const { items, refine } = useMenu({
    attribute: FACET_LOCATION_CITY,
    limit: 50,
  });

  const value = items.find((i) => i.isRefined)?.value ?? "";

  return (
    <div className="relative w-fit shrink-0">
      <Icon
        name="map"
        className="pointer-events-none absolute left-3 top-1/2 z-1 -translate-y-1/2 text-neutral-default bottom-[8px]"
        size={16}
      />
      <select
        aria-label="Filter by location"
        className="w-fit appearance-none rounded-[8px] border border-[#DEE0E3] bg-white py-2.5 pl-9 pr-6 text-sm font-semibold text-neutral-default focus:outline-none focus:ring-0 cursor-pointer transition-all duration-300 hover:border-ocean"
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          if (!next) {
            const current = items.find((i) => i.isRefined);
            if (current) refine(current.value);
            return;
          }
          refine(next);
        }}
      >
        <option value="">Filter By Location</option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label} ({item.count})
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-default"
        size={20}
      />
    </div>
  );
}

export function VolunteerMissionsAlgolia({
  appId,
  apiKey,
  onMissionsUiReady,
}: {
  appId: string;
  apiKey: string;
  /** Called once when credentials are missing, or when the first Algolia search reaches `idle`. */
  onMissionsUiReady?: () => void;
}) {
  const searchClient = useMemo(
    () => createSearchClient(appId, apiKey),
    [appId, apiKey],
  );

  const canSearch = Boolean(appId && apiKey);
  const onReadyRef = useRef(onMissionsUiReady);
  onReadyRef.current = onMissionsUiReady;

  useEffect(() => {
    if (canSearch) return;
    onReadyRef.current?.();
  }, [canSearch]);

  if (!canSearch) {
    return (
      <p className="text-neutral-default content-padding text-center 2xl:px-0">
        Mission search is unavailable. Algolia credentials are not configured
        for this environment.
      </p>
    );
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={VOLUNTEER_MISSIONS_ALGOLIA_INDEX}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <MissionSearchReadyReporter onReady={onMissionsUiReady} />
      <Configure hitsPerPage={12} />

      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <CategoryFilterPills />
        </div>
        <LocationFilterSelect />
      </div>

      <MissionHitsCarousel />
    </InstantSearch>
  );
}
