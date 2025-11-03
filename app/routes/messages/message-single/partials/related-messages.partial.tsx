/**
 * We will plan to rework this component once we have a way to fetch the related messages.
 */

import { Button } from "~/primitives/button/button.primitive";
import { useLoaderData } from "react-router-dom";
import { SectionTitle } from "~/components";
import { useMemo } from "react";
import { createSearchClient } from "~/lib/create-search-client";
import { LoaderReturnType } from "../loader";
import { RelatedMessagesCarousel } from "../components/messages-carousel.component";
import { Configure, InstantSearch } from "react-instantsearch";
import { HitsWrapper } from "~/components/hits-wrapper";

export const RelatedMessages = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, message } =
    useLoaderData<LoaderReturnType>();
  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  // Create filter for the primary category and sermon type
  // If primary category exists, filter by it; otherwise show all sermons (Recent)
  const categoryFilter = message.primaryCategories[0]?.value
    ? `contentType:"Sermon" AND sermonPrimaryCategories:"${message.primaryCategories[0]?.value}" AND NOT title:"${message.title}" AND NOT sermonSeriesName:"${message.seriesTitle}"`
    : `contentType:"Sermon" AND NOT title:"${message.title}" AND NOT sermonSeriesName:"${message.seriesTitle}"`;

  return (
    <InstantSearch
      indexName="dev_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure filters={categoryFilter} hitsPerPage={10} />

      <HitsWrapper>
        <div className="bg-white w-full flex justify-center content-padding">
          <div className="flex w-full  flex-col items-center py-12 md:py-24 max-w-screen-content">
            {/* Header */}
            <div className="w-full flex justify-between">
              <div className="gap-6 md:gap-8">
                <SectionTitle sectionTitle="related messages." />
                <h2 className="text-text font-extrabold text-[28px] lg:text-[32px] leading-tight">
                  Other Messages On This Topic
                </h2>
              </div>
              <div className="flex items-end justify-between text-lg font-semibold">
                <Button
                  href={`/messages/#${message.primaryCategories[0]?.value}`}
                  size="md"
                  className="hidden lg:block"
                  intent="primary"
                >
                  View All
                </Button>
              </div>
            </div>

            <RelatedMessagesCarousel />
          </div>
        </div>
      </HitsWrapper>
    </InstantSearch>
  );
};
