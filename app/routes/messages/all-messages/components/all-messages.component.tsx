import { useLoaderData } from "react-router-dom";
import { InstantSearch, Configure, useHits } from "react-instantsearch";
import { useMemo } from "react";

import { SectionTitle } from "~/components";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { ContentItemHit } from "~/routes/search/types";
import { CustomPagination } from "~/components/custom-pagination";
import { HubsTagsRefinementList } from "~/components/hubs-tags-refinement";
import { createSearchClient } from "~/lib/create-search-client";

interface LoaderData {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
}

export type Tag = {
  label: string;
  isActive: boolean;
};

export default function Messages() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderData>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <section className="relative py-32 min-h-screen bg-white content-padding pagination-scroll-to">
      <div className="relative max-w-screen-content mx-auto">
        <SectionTitle
          className="mb8"
          sectionTitle="all messages."
          title="Christ Fellowship Church Messages"
        />
        <InstantSearch
          indexName="dev_daniel_contentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure filters='contentType:"Sermon"' hitsPerPage={9} />

          {/* Filter Section */}
          <div className="mt-10 mb-12">
            <div className="md:hidden">
              <HubsTagsRefinementList
                tagName="sermonPrimaryTags"
                wrapperClass="flex flex-nowrap px-1 pb-1 overflow-x-auto scrollbar-hide"
                buttonClassDefault="w-fit min-w-[180px] flex justify-between group px-2 border-b-3 transition-colors"
                buttonClassSelected="border-ocean text-ocean"
                buttonClassUnselected="border-neutral-lighter text-text-secondary"
              />
            </div>
            <div className="hidden md:block">
              <HubsTagsRefinementList tagName="sermonPrimaryTags" />
            </div>
          </div>

          {/* Results Grid */}
          <AllMessagesHit />

          <CustomPagination />
        </InstantSearch>
      </div>
    </section>
  );
}

const AllMessagesHit = () => {
  const { items } = useHits<ContentItemHit>();

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:!gap-8 justify-center items-center">
      {items.map((hit) => (
        <MessageHit hit={hit} key={hit.objectID} />
      ))}
    </div>
  );
};

const MessageHit = ({ hit }: { hit: ContentItemHit }) => {
  const formattedDate = new Date(hit.startDateTime).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <ResourceCard
      resource={{
        id: hit.objectID,
        contentChannelId: "63", // MESSAGE type from builder-utils.ts
        contentType: "MESSAGES",
        author: hit.author.firstName + " " + hit.author.lastName,
        image: hit.coverImage.sources[0].uri,
        name: hit.title,
        summary: hit.summary,
        pathname: `/messages/${hit.url}`,
        startDate: formattedDate,
      }}
    />
  );
};
