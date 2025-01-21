import { liteClient as algoliasearch } from "algoliasearch/lite";

import { InstantSearch, Hits, SearchBox, Configure } from "react-instantsearch";

import { CustomPagination } from "../components/custom-pagination.component";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import { CustomClearRefinements } from "../components/custom-clear-refinements.component";
import { HitComponent } from "../components/hit-component.component";
import SectionTitle from "~/components/section-title";
import { useMediaQuery } from "react-responsive";
import { GroupFilters } from "~/components/modals/group-filters/group-filters";
import { GroupFiltersModal } from "~/components/modals/group-filters/group-filters-modal";
import Icon from "~/primitives/icon";

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  const isLarge = useMediaQuery({ minWidth: 1280 });
  const isMedium = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
  const isSmall = useMediaQuery({ maxWidth: 767 });

  const getHitsPerPage = () => {
    switch (true) {
      case isLarge:
        return 9;
      case isMedium:
        return 8;
      case isSmall:
        return 6;
      default:
        return 6; // Fallback value
    }
  };

  return (
    <div
      className="flex flex-col gap-4 w-full max-w-screen-content py-12"
      id="search"
    >
      <SectionTitle
        sectionTitle="search all groups."
        title="Find Your Community"
      />
      <InstantSearch
        indexName="production_Groups"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true, // Set this to true to adopt the new behavior
        }}
      >
        <Configure hitsPerPage={getHitsPerPage()} />
        {/* Search Box */}
        <div className="mb-6 w-full">
          {/* TODO: Add a search button/icon correctly... */}
          <SearchBox
            placeholder="Search for groups..."
            submitIconComponent={() => (
              <Icon name="searchAlt" className="text-neutral-300" />
            )}
            classNames={{
              form: "flex flex-row-reverse items-center justify-center rounded-lg shadow-sm border-neutral-lighter border-2 focus:outline-none focus:border-ocean px-4 py-2",
              input: "w-full justify-center text-xl px-3 focus:outline-none",
              // resetIcon: "hidden",
              // submit: "hidden",
              submitIcon: "hidden",
            }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 md:gap-24">
          {/* Refinement List */}
          <div className="hidden lg:block">
            <GroupFilters />
          </div>
          <div className="lg:hidden">
            <GroupFiltersModal />
          </div>

          {/* Hits and Pagination */}
          <div className="bg-white rounded-lg col-span-1 lg:col-span-2 xl:col-span-3">
            <div className="flex w-full justify-between lg:justify-end pb-9">
              <CustomClearRefinements text="Clear all filters" />
            </div>
            <Hits
              classNames={{
                list: "grid md:grid-cols-2 xl:grid-cols-3 gap-6",
              }}
              hitComponent={HitComponent}
            />
            <div className="mt-6 flex justify-end">
              <CustomPagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};
