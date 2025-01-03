import { liteClient as algoliasearch } from "algoliasearch/lite";

import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
} from "react-instantsearch";

import { CustomPagination } from "../components/custom-pagination.component";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import { MenuSelect } from "../components/custom-menu.component";
import { CustomClearRefinements } from "../components/custom-clear-refinements.component";
import { HitComponent } from "../components/Hit.component";
import SectionTitle from "~/components/section-title";

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  return (
    <div
      className="flex flex-col gap-4 w-full max-w-[1440px] px-4 md:px-8 py-12"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Refinement List */}
          <div className="flex flex-col gap-12 bg-white p-4 frounded-lg shadow-md col-span-1">
            <div className="flex flex-col gap-3 text-black">
              {/* TODO: Update styling  */}
              <CustomClearRefinements />
              <h3 className="heading-h6">Campus</h3>
              <MenuSelect
                placeholder="Select a campus..."
                attribute="campusName"
                limit={20}
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="heading-h6">Meeting Type</h3>
              <MenuSelect
                placeholder="Select a meeting type..."
                attribute="meetingType"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="heading-h6">Hubs</h3>
              <RefinementList
                classNames={{
                  list: "flex flex-col gap-3",
                  checkbox: "hidden",
                  count: "hidden",
                  labelText: "text-xl font-bold",
                  item: "rounded-[24px] border border-[#D0D0CE] text-[#D0D0CE]",
                  selectedItem:
                    "bg-oceanSubdued text-ocean border-[#0092BC] overflow-hidden rounded-[24px]",
                  label:
                    "flex items-center justify-center w-full max-w-80 gap-2 py-2",
                }}
                attribute="preferences"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="heading-h6">Types of Groups</h3>
              <RefinementList
                classNames={{
                  list: "flex flex-col gap-3",
                  checkbox: "hidden",
                  count: "hidden",
                  labelText: "text-xl font-bold",
                  item: "rounded-[24px] border border-[#D0D0CE] text-[#D0D0CE]",
                  selectedItem:
                    "bg-oceanSubdued text-ocean border-[#0092BC] overflow-hidden rounded-[24px]",
                  label:
                    "flex items-center justify-center w-full max-w-80 gap-2 py-2",
                }}
                attribute="subPreferences"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="heading-h6">Meeting Day</h3>
              <RefinementList
                classNames={{
                  list: "flex flex-col gap-3",
                  checkbox: "hidden",
                  count: "hidden",
                  labelText: "text-xl font-bold",
                  item: "rounded-[24px] border border-[#D0D0CE] text-[#D0D0CE]",
                  selectedItem:
                    "bg-oceanSubdued text-ocean border-[#0092BC] overflow-hidden rounded-[24px]",
                  label:
                    "flex items-center justify-center w-full max-w-80 gap-2 py-2",
                }}
                attribute="meetingDay"
              />
            </div>
          </div>

          {/* Hits and Pagination */}
          <div className="bg-white p-4 rounded-lg shadow-md col-span-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Search Results
            </h2>
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
