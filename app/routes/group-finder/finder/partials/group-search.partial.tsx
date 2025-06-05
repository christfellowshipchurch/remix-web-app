import { useLoaderData } from "react-router";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  Stats,
} from "react-instantsearch";

import { GroupFiltersModal } from "~/components";
import { DesktopGroupFilters } from "~/components/modals/group-filters/group-filters";

import Icon from "~/primitives/icon";
import { useResponsive } from "~/hooks/use-responsive";

import { CustomPagination } from "../components/custom-pagination.component";
import { LoaderReturnType } from "../loader";
import { HitComponent } from "../components/hit-component.component";
import { GroupsLocationSearch } from "../components/location-search.component";
import { useState } from "react";

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  return (
    <div className="flex flex-col gap-4 w-full pt-12" id="search">
      <InstantSearch
        indexName="production_Groups"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <ResponsiveConfigure selectedLocation={selectedLocation} />
        <div className="flex flex-col">
          {/* Filters Section */}
          <div className="relative md:static content-padding border-b-2 border-black/10 border-solid">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 lg:gap-4 xl:gap-8 py-4 max-w-screen-content mx-auto">
              {/* Search Boxes */}
              <div className="flex gap-4">
                {/* Group Search Box */}
                <div className="w-[240px] lg:w-[266px] flex items-center rounded-[8px] bg-[#EDF3F8] focus-within:border-ocean py-2">
                  <Icon name="searchAlt" className="text-[#666666] ml-3" />
                  <SearchBox
                    placeholder="Keyword"
                    translations={{
                      submitButtonTitle: "Search",
                      resetButtonTitle: "Reset",
                    }}
                    classNames={{
                      root: "flex-grow",
                      form: "flex",
                      input: "w-full text-xl px-2 focus:outline-none",
                      resetIcon: "hidden",
                      submit: "hidden",
                    }}
                  />
                </div>
                {/* Location Select Box */}
                <GroupsLocationSearch
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:block">
                <DesktopGroupFilters />
              </div>

              {/* Mobile Filters */}
              <div className="md:hidden">
                <GroupFiltersModal />
              </div>
            </div>
          </div>

          {/* Group Search Results & Pagination */}
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
                  list: "grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-x-8 gap-y-6 md:gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1000px] xl:max-w-[1200px]",
                }}
                hitComponent={HitComponent}
              />
              <div className="mt-6 flex justify-center md:justify-start">
                <CustomPagination />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

const ResponsiveConfigure = ({
  selectedLocation,
}: {
  selectedLocation: string | null;
}) => {
  const { isSmall, isMedium, isLarge, isXLarge } = useResponsive();

  const hitsPerPage = (() => {
    switch (true) {
      case isXLarge:
        return 16;
      case isMedium || isLarge:
        return 9;
      case isSmall:
        return 5;
      default:
        return 5;
    }
  })();

  return (
    <Configure
      hitsPerPage={hitsPerPage}
      filters={
        selectedLocation ? `campusName:'${selectedLocation}'` : undefined
      }
    />
  );
};
