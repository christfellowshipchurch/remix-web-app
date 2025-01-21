import { liteClient as algoliasearch } from "algoliasearch/lite";

import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
  Configure,
} from "react-instantsearch";

import { CustomPagination } from "../components/custom-pagination.component";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import { MenuSelect } from "../components/custom-menu.component";
import { CustomClearRefinements } from "../components/custom-clear-refinements.component";
import { HitComponent } from "../components/hit-component.component";
import SectionTitle from "~/components/section-title";
import { useMediaQuery } from "react-responsive";
import { GroupFilters } from "~/components/modals/group-filters/group-filters";
import { GroupFiltersModal } from "~/components/modals/group-filters/group-filters-modal";

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  const isDesktop = useMediaQuery({ minWidth: 1024 });

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
        <Configure hitsPerPage={isDesktop ? 9 : 6} />
        {/* Search Box */}
        <div className="mb-6 w-full">
          <SearchBox
            placeholder="🔍 Search for groups..."
            classNames={{
              input:
                "w-full justify-center text-xl px-4 py-2 rounded-lg shadow-sm border-gray-300 border-2",
              submit: "hidden",
              resetIcon: "hidden",
            }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:gap-6">
          {/* Refinement List */}
          <div className="hidden lg:block">
            <GroupFilters />
          </div>
          <div className="lg:hidden">
            <GroupFiltersModal />
          </div>

          {/* Hits and Pagination */}
          <div className="bg-white p-4 rounded-lg col-span-1 lg:col-span-3">
            <div className="flex w-full justify-between lg:justify-end pb-9">
              <CustomClearRefinements />
            </div>
            <Hits
              classNames={{
                list: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
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
