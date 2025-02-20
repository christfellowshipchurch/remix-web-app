import { useLoaderData } from "react-router";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  Configure,
  RefinementList,
} from "react-instantsearch";
import { useMemo } from "react";

import SectionTitle from "~/components/section-title";
import { ContentCard } from "~/primitives/content-card/content.card.primitive";
import { Icon } from "~/primitives/icon/icon";
import { ContentItemHit } from "~/routes/search/types";
import { CustomPagination } from "./custom-pagination.component";

interface LoaderData {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
}

export type Tag = {
  label: string;
  isActive: boolean;
};

const MessageHitComponent = ({ hit }: { hit: ContentItemHit }) => (
  <ContentCard
    image={hit.coverImage.sources[0].uri}
    title={hit.title}
    subheadings={[
      { title: hit.summary.split("|")[0] },
      {
        icon: "user",
        title: `${hit.author.firstName} ${hit.author.lastName}`,
      },
    ]}
    cta={{
      title: "Watch Now",
      href: `/${hit.routing.pathname}`,
    }}
  />
);

export const mockTags = [
  { label: "Tag", isActive: true },
  { label: "Mens", isActive: false },
  { label: "Women", isActive: false },
  { label: "Kids & Students", isActive: false },
  { label: "Young Adults", isActive: false },
  { label: "Volunteer", isActive: false },
];

export const FilterButtons = ({ tags = mockTags }: { tags?: Tag[] }) => {
  return (
    <div className="relative w-full overflow-x-auto max-w-[90vw]">
      <div className="flex gap-6 flex-nowrap px-1 pb-4">
        {tags.map((tag, index) => (
          <div
            key={`${tag.label}-${index}`}
            className={`text-semiboldshrink-0 px-6 py-3 rounded-full justify-center items-center flex cursor-pointer whitespace-nowrap ${
              tag.isActive
                ? "border border-neutral-600 text-neutral-600"
                : "bg-gray text-neutral-500 hover:bg-neutral-200 transition-colors duration-300"
            }`}
          >
            <div className="text-xl font-semibold font-['Proxima Nova'] leading-7">
              {tag.label}
            </div>
            {tag.isActive && (
              <Icon className="text-ocean ml-2 mr-[-6px]" name="x" size={24} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

export default function Messages() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderData>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <section className="relative py-32 min-h-screen bg-white content-padding">
      <div className="relative max-w-screen-content mx-auto">
        <SectionTitle
          className="mb8"
          sectionTitle="all messages."
          title="Christ Fellowship Church Messages"
        />
        {/* Filter Buttons - just placeholder ones for now. Eventually, we'll use the algolia filters */}
        <div className="mt-10 mb-12">
          <FilterButtons tags={mockTags} />
        </div>
        <InstantSearch
          indexName="production_ContentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure filters='contentType:"Sermon"' hitsPerPage={9} />

          {/* Filter Section */}
          <div className="mt-10 mb-12">
            <RefinementList
              attribute="tags"
              classNames={{
                list: "flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto",
                item: "shrink-0",
                label: "cursor-pointer",
                checkbox: "hidden",
                labelText:
                  "px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap bg-gray text-neutral-500 hover:bg-neutral-200 transition-colors duration-300",
                selectedItem:
                  "border border-neutral-600 text-neutral-600 bg-white",
              }}
            />
          </div>

          {/* Results Grid */}
          <Hits
            hitComponent={MessageHitComponent}
            classNames={{
              list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center",
            }}
          />

          <CustomPagination />
        </InstantSearch>
      </div>
    </section>
  );
}
