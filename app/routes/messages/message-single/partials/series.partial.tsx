import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { InstantSearch, Hits, Configure } from "react-instantsearch";
import { LoaderReturnType } from "../loader";
import { SeriesCard } from "../components/this-series-card.component";
import { ContentItemHit } from "~/routes/search/types";
import { createSearchClient } from "~/lib/create-search-client";
import { HitsWrapper } from "~/components/hits-wrapper";

const SeriesHitComponent = ({ hit }: { hit: ContentItemHit }) => {
  return (
    <SeriesCard
      message={{
        id: hit.rockItemId.toString(),
        title: hit.title,
        content: hit?.htmlContent || "",
        summary: hit.summary,
        image: hit.coverImage.sources[0].uri,
        coverImage: hit.coverImage.sources[0].uri,
        video: "",
        startDateTime: hit.startDateTime || "",
        expireDateTime: "",
        seriesId: "",
        seriesTitle: hit.sermonSeriesName || "",
        url: hit.url || hit.routing.pathname,
        primaryCategories:
          hit.sermonPrimaryCategories?.map((tag) => ({ value: tag })) || [],
        secondaryCategories:
          hit.sermonSecondaryCategories?.map((tag) => ({ value: tag })) || [],
        speaker: {
          fullName: hit.author.firstName + " " + hit.author.lastName,
          profilePhoto: "",
          guid: "",
        },
      }}
    />
  );
};

export const InThisSeries = () => {
  const { message, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  if (!message.seriesTitle) {
    return null;
  }

  const filter = `contentType:"Sermon" AND sermonSeriesName:"${message.seriesTitle}" AND NOT rockItemId:"${message.id}"`;

  return (
    <InstantSearch
      indexName="dev_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure filters={filter} hitsPerPage={10} />
      <div className="flex w-full flex-col gap-6 py-12 md:pt-0 md:pb-24 content-padding">
        <div className="flex flex-col gap-1 md:gap-2 w-full max-w-screen-content mx-auto">
          <h2 className="font-extrabold text-[28px] lg:text-[32px]">
            In This Series
          </h2>
          <p className="text-[#AAAAAA]">{message.seriesTitle}</p>
        </div>

        <HitsWrapper>
          <Hits
            hitComponent={SeriesHitComponent}
            classNames={{
              list: "flex overflow-y-hidden overflow-x-auto gap-6 xl:gap-8 py-2 max-w-screen-content w-full mx-auto max-h-[300px]",
              item: "w-full min-w-[318px] max-w-[350px]",
            }}
          />
        </HitsWrapper>
      </div>
    </InstantSearch>
  );
};
