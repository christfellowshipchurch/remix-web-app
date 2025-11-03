import { useLoaderData } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Hits, Stats, Configure } from "react-instantsearch";

import { cn } from "~/lib/utils";
import { LoaderReturnType } from "../loader";
import { useState } from "react";
import { UpcomingSessionCard } from "../components/upcoming-sessions/upcoming-session-card.component";
import { FindersCustomPagination } from "~/routes/group-finder/components/finders-custom-pagination.component";
import { UpcomingSessionFilters } from "../components/upcoming-sessions/upcoming-session-filters.component";
import { useResponsive } from "~/hooks/use-responsive";

export const UpcomingSessionsSection = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, classUrl } =
    useLoaderData<LoaderReturnType>();

  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(null);

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  return (
    <div className="flex flex-col gap-4 w-full md:pt-12 relative" id="search">
      <InstantSearch
        indexName="dev_Classes"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <ResponsiveClassesSingleConfigure
          selectedLocation={null}
          coordinates={coordinates}
          classUrl={classUrl}
        />
        <div className="flex flex-col">
          {/* Filters Section */}
          <div
            className={cn(
              "bg-white content-padding shadow-sm select-none transition-all duration-300",
              "relative z-10"
            )}
          >
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-4 py-4 max-w-screen-content mx-auto lg:h-20 pagination-scroll-to">
              {/* Title */}
              <div className="flex items-center gap-4 w-fit">
                <h2 className="text-[28px] font-extrabold w-fit min-w-[260px]">
                  Upcoming Sessions
                </h2>
                <div className="hidden lg:block h-full w-[1px] bg-text-secondary" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-fit overflow-x-auto md:overflow-x-visible scrollbar-hide relative">
                {/* Filters */}
                <UpcomingSessionFilters
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                />
              </div>
            </div>
          </div>

          {/* Session Results & Pagination */}
          <div className="flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding">
            <div className="max-w-screen-content mx-auto md:w-full">
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
                  root: "flex items-center justify-center md:items-start md:justify-start w-full",
                  item: "flex items-center justify-center md:items-start md:justify-start w-full",
                  list: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 xl:!gap-x-8 gap-y-6 md:gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1296px]",
                }}
                hitComponent={UpcomingSessionCard}
              />
              <div className="mt-6 flex justify-center md:justify-start">
                <FindersCustomPagination />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

const ResponsiveClassesSingleConfigure = ({
  selectedLocation,
  classUrl,
  coordinates,
}: {
  selectedLocation: string | null;
  classUrl: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
}) => {
  const { isSmall, isMedium, isLarge, isXLarge } = useResponsive();

  const hitsPerPage = (() => {
    switch (true) {
      case isXLarge || isLarge:
        return 12;
      case isMedium:
        return 9;
      case isSmall:
        return 5;
      default:
        return 5;
    }
  })();

  // Build filters array
  const filters = [];
  if (selectedLocation) {
    filters.push(`campusName:'${selectedLocation}'`);
  }
  if (classUrl) {
    filters.push(`classTypeUrl:"${classUrl}"`);
  }

  return (
    <Configure
      key={`${coordinates?.lat}-${coordinates?.lng}-${selectedLocation}-${classUrl}`}
      hitsPerPage={hitsPerPage}
      filters={filters.length > 0 ? filters.join(" AND ") : undefined}
      aroundLatLng={
        coordinates?.lat && coordinates?.lng
          ? `${coordinates.lat}, ${coordinates.lng}`
          : undefined
      }
      aroundRadius="all"
      aroundLatLngViaIP={false}
      getRankingInfo={true}
    />
  );
};
