import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  RefinementList,
} from "react-instantsearch";
import { ContentItemHit } from "./types";
import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "./loader";

export { loader } from "./loader";

export default function TestingSearch() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Testing Algolia Search
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          This is a test page to see how Algolia search works in the app.
        </p>
        <InstantSearch
          indexName="production_ContentItems"
          searchClient={searchClient}
        >
          {/* Search Box */}
          <div className="mb-6">
            <SearchBox
              placeholder="Search for content..."
              classNames={{
                input:
                  "w-full justify-center max-w-lg text-xl px-4 py-2 rounded-lg shadow-sm border-gray-300 border-2",
                submit: "hidden",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Refinement List */}
            <div className="bg-white p-4 rounded-lg shadow-md col-span-1">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Filter by Category
              </h2>
              <h3 className="heading-h6">First Name</h3>
              <RefinementList attribute="author.firstName" />
              <h3 className="heading-h6">Last Name</h3>
              <RefinementList attribute="author.lastName" />
            </div>

            {/* Hits and Pagination */}
            <div className="bg-white p-4 rounded-lg shadow-md col-span-3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Search Results
              </h2>
              <Hits
                classNames={{
                  list: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
                }}
                hitComponent={HitComponent}
              />
              <div className="mt-6">
                <Pagination
                  classNames={{
                    list: "flex justify-center gap-6",
                  }}
                />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

// Custom Component for Displaying Individual Hits
function HitComponent({ hit }: { hit: ContentItemHit }) {
  return (
    <div className="p-4 h-full mb-4 bg-gray-100 rounded-lg shadow-sm hover:scale-105 transition-transform">
      <a href={hit.routing.pathname}>
        <img
          src={hit.coverImage.sources[0].uri}
          alt={hit.title}
          className="w-full h-48 object-cover mb-4 rounded-lg"
        />
        <h3 className="text-lg font-medium text-gray-800">{hit.title}</h3>
        <p className="text-sm text-gray-600">{hit.summary}</p>
      </a>
    </div>
  );
}
