import { useLoaderData } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  Configure,
  useRefinementList,
  useInstantSearch,
} from "react-instantsearch";
import { useMemo, useState } from "react";

import { SectionTitle } from "~/components";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { ContentItemHit } from "~/routes/search/types";
import { CustomPagination } from "./custom-pagination.component";
import { MessagesTagsRefinementList } from "./messages-tags-refinement.component";

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
    <section className="relative py-32 min-h-screen bg-white content-padding">
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
            <MessagesTagsRefinementList />
          </div>

          {/* Results Grid */}
          <Hits
            hitComponent={({ hit }: { hit: ContentItemHit }) => {
              return <MessageHit hit={hit} />;
            }}
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

export const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});
