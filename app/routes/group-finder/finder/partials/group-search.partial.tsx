import { useLoaderData } from "react-router";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Hits, SearchBox, Configure } from "react-instantsearch";

import { SectionTitle, GroupFiltersModal } from "~/components";
import { GroupFilters } from "~/components/modals/group-filters/group-filters";

import Icon from "~/primitives/icon";
import { useResponsive } from "~/hooks/use-responsive";

import { CustomPagination } from "../components/custom-pagination.component";
import { LoaderReturnType } from "../loader";
import { CustomClearRefinements } from "../components/custom-clear-refinements.component";
import { HitComponent } from "../components/hit-component.component";

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  const { isSmall, isMedium, isXLarge } = useResponsive();

  const getHitsPerPage = () => {
    switch (true) {
      case isXLarge:
        return 9;
      case isMedium:
        return 8;
      case isSmall:
        return 6;
      default:
        return 6;
    }
  };

  return (
    <div
      className="flex flex-col gap-4 w-full max-w-screen-content mx-auto py-12"
      id="search"
    >
      <InstantSearch
        indexName="production_Groups"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure hitsPerPage={getHitsPerPage()} />
        <div className="flex flex-col gap-4 lg:gap-12">
          <div className="flex flex-col gap-4 lg:gap-8">
            <SectionTitle
              sectionTitle="search all groups."
              title="Find Your Community"
              leading="leading-none"
            />

            {/* Search Box */}
            <div className="w-full relative flex items-center rounded-md border-neutral-lighter border-2 box-border focus-within:border-ocean py-2">
              <Icon
                name="searchAlt"
                className="text-neutral-300 ml-3 hidden md:block"
              />
              <SearchBox
                placeholder="Search for groups..."
                submitIconComponent={() => (
                  <>{!isSmall ? "Search" : <Icon name="searchAlt" />}</>
                )}
                translations={{
                  submitButtonTitle: "Search",
                  resetButtonTitle: "Reset",
                }}
                classNames={{
                  root: "flex-grow",
                  form: "flex pr-10 md:pr-24",
                  input:
                    "w-full justify-center text-xl px-3 focus:outline-none",
                  resetIcon: "hidden",
                  submit:
                    "absolute right-0 top-0 bottom-0 transition-colors bg-ocean text-white hover:bg-navy text-md px-3 md:px-5 h-[48px] translate-y-[-2px] translate-x-[2px] rounded-r-md",
                }}
              />
            </div>
          </div>

          <div className="h-[1px] w-full bg-coconut my-4 lg:hidden" />
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 lg:gap-24">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <GroupFilters />
            </div>

            {/* Mobile Filters */}
            <div className="flex justify-between lg:hidden">
              <div>
                <GroupFiltersModal />
              </div>
              <CustomPagination />
            </div>

            {/* Hits and Pagination */}
            <div className="bg-white rounded-lg col-span-1 lg:col-span-2 xl:col-span-3 pt-8 md:pt-12 lg:pt-0">
              <div className="w-full justify-between lg:justify-end my-8 md:my-0 md:mb-9 hidden lg:flex">
                <CustomClearRefinements text="Clear all filters" />
              </div>
              <Hits
                classNames={{
                  root: "flex justify-center",
                  item: "flex justify-center",
                  list: "grid sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[900px]",
                }}
                hitComponent={HitComponent}
              />
              <div className="mt-6 flex justify-center lg:justify-end">
                <CustomPagination />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};
