import { algoliasearch } from "algoliasearch";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { LoaderReturnType } from "../loader";
import { useLoaderData } from "react-router-dom";
import { AllClassFiltersPopup } from "~/routes/class-finder/finder/components/popups/all-filters.component";
import { Button } from "~/primitives/button/button.primitive";

import { Hits, InstantSearch, Stats } from "react-instantsearch";
import { UpcomingSessionCard } from "../components/upcoming-sessions/upcoming-session-card.component";
import { FindersCustomPagination } from "~/routes/group-finder/components/finders-custom-pagination.component";
import { ResponsiveClassesSingleConfigure } from "./upcoming-sections.partial";

export function UpcomingSessionMobileSection() {
  const { classUrl, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  return (
    <div className="flex md:hidden flex-col gap-4 max-w-screen-content mx-auto pagination-scroll-to">
      <div className="flex items-center gap-4 w-fit content-padding">
        <h2 className="text-[28px] font-extrabold w-fit min-w-[260px]">
          Upcoming Sessions
        </h2>
      </div>

      <div
        className="flex flex-col gap-4 w-screen pagination-scroll-to"
        id="search"
      >
        <InstantSearch
          indexName="dev_Classes"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <ResponsiveClassesSingleConfigure
            classUrl={classUrl}
            selectedLocation={null}
            coordinates={coordinates}
          />
          <div className="flex flex-col">
            <div className="bg-white pb-5 border-b-2 border-black/10 border-solid select-none">
              <div className="content-padding">
                <Button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  intent="secondary"
                  className="flex items-center gap-2 border-2 px-8 w-full text-text-primary rounded-[8px]"
                >
                  <Icon name="sliderAlt" className="text-navy" />
                  All Filters
                </Button>
              </div>

              <div
                className={cn(
                  "absolute transition-all duration-300",
                  isMobileOpen
                    ? "z-4 opacity-100 top-[calc(99%)]"
                    : "-z-1 opacity-0"
                )}
              >
                <AllClassFiltersPopup
                  hideTopic={true}
                  onHide={() => setIsMobileOpen(false)}
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                />
              </div>
            </div>

            {/* Class Search Results / Class Type Filters */}
            <div className="flex flex-col bg-gray py-8 w-full content-padding">
              <div className="max-w-screen-content mx-auto ">
                <div className="flex flex-col bg-gray py-8 w-full content-padding">
                  <div className="max-w-screen-content mx-auto">
                    <Stats
                      classNames={{
                        root: "text-text-secondary mb-6",
                      }}
                      translations={{
                        rootElementText: ({ nbHits }) =>
                          `${nbHits.toLocaleString()} Results Found`,
                      }}
                    />

                    <Hits
                      classNames={{
                        root: "flex items-center justify-center w-full",
                        item: "flex items-center justify-center w-full",
                        list: "grid sm:grid-cols-2 gap-x-4 xl:!gap-x-8 gap-y-6 w-full",
                      }}
                      hitComponent={UpcomingSessionCard}
                    />
                    <div className="mt-6 flex justify-center">
                      <FindersCustomPagination />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}
