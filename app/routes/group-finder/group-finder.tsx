import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  RefinementList,
} from "react-instantsearch";
import { GroupHit } from "./types";

import { useLoaderData } from "react-router";
import { DynamicHero } from "~/components/dynamic-hero";
import { LoaderReturnType } from "./loader";
import { useState } from "react";
import Icon from "~/primitives/icon";
import Button from "~/primitives/button";

function HitComponent({ hit }: { hit: GroupHit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const meetingType = hit.meetingType;
  const tags = hit.preferences.join(", ");

  return (
    <div
      className="h-full mb-4 bg-white rounded-lg overflow-hidden"
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex flex-col h-full pb-6">
        <div className="relative flex flex-col gap-2">
          <img
            src={coverImage}
            alt={hit.title}
            className="w-full h-48 object-cover mb-4 overflow-hidden"
          />
          <div className="flex gap-1 absolute -bottom-4 right-4">
            {hit?.leaders.map((leader, i) => (
              <img
                className="rounded-lg stroke-[#EBEBEF] size-20"
                src={leader.photo.uri}
                key={i}
                alt={leader.firstName}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 px-4 h-full justify-between">
          <div className="flex flex-col gap-1">
            <div className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
              {meetingType}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold leading-6 text-text-primary">
                {hit.title}
              </h3>
              <p className="text-sm text-black">{tags}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon name="map" size={20} color="black" />
              <p className="text-sm font-semibold">{hit.campusName}</p>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="calendarAlt" size={20} color="black" />
              <p className="text-sm font-semibold">{hit.meetingDay}</p>
            </div>
            <div>
              <p
                className={`text-sm text-text-primary ${
                  isExpanded ? "" : "line-clamp-3"
                }`}
              >
                {hit.summary}
              </p>
              {hit.summary.length > 100 && (
                <button
                  className="text-ocean text-sm font-semibold text-start"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "See Less" : "See More"}
                </button>
              )}
            </div>
          </div>
          {/* TODO: Open Contact Group Leader Modal */}
          <Button className="rounded-lg font-semibold h-12">Contact</Button>
        </div>
      </div>
    </div>
  );
}

export function GroupFinder() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  return (
    <div className="flex flex-col items-center">
      <DynamicHero imagePath="../app/assets/images/groups-hero-bg.jpg" />
      <div className="flex flex-col items-center w-full max-w-[1440px] px-4 md:px-8 py-12 ">
        <h1 className="heading-h1 w-full">Find Your Community</h1>
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
              placeholder="Search for .."
              classNames={{
                input:
                  "w-full justify-center text-xl px-4 py-2 rounded-lg shadow-sm border-gray-300 border-2",
                submit: "hidden",
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Refinement List */}
            <div className="flex flex-col gap-12 bg-white p-4 frounded-lg shadow-md col-span-1">
              <div className="flex flex-col gap-3">
                <h3 className="heading-h6">Campus</h3>
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
                  attribute="campusName"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="heading-h6">Meeting Type</h3>
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
                  attribute="hubs"
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
              <div className="mt-6">
                <Pagination
                  classNames={{
                    list: "flex justify-center gap-6",
                  }}
                  showFirst={false}
                  showLast={false}
                  showPrevious={true}
                  showNext={true}
                  padding={2}
                  totalPages={20}
                />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}
