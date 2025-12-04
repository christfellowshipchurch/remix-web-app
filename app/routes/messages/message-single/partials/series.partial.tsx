import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { InstantSearch, Hits, Configure, useHits } from "react-instantsearch";
import { LoaderReturnType } from "../loader";
import { SeriesCard } from "../components/this-series-card.component";
import { ContentItemHit } from "~/routes/search/types";
import { createSearchClient } from "~/lib/create-search-client";

const SeriesHitComponent = ({ hit }: { hit: ContentItemHit }) => {
  return (
    <SeriesCard
      message={{
        title: hit.title,
        summary: hit.summary,
        coverImage: hit.coverImage.sources[0].uri,
        url: hit.url || hit.routing.pathname,
      }}
    />
  );
};

const SeriesContent = ({ seriesTitle }: { seriesTitle: string }) => {
  const { items } = useHits<ContentItemHit>();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6 py-12 md:pt-0 md:pb-24">
      <div className="content-padding">
        <div className="flex flex-col gap-1 md:gap-2 w-full max-w-screen-content mx-auto">
          <h2 className="font-extrabold text-[28px] lg:text-[32px]">
            In This Series
          </h2>
          <p className="text-[#AAAAAA]">{seriesTitle}</p>
        </div>
      </div>

      <div className="pl-5 md:pl-12 lg:pl-18 2xl:pr-18">
        <div className="max-w-screen-content mx-auto">
          <Hits
            hitComponent={SeriesHitComponent}
            classNames={{
              list: "flex overflow-y-hidden overflow-x-auto gap-6 xl:gap-8 py-2 max-w-screen-content w-full max-h-[300px]",
              item: "w-full min-w-[318px] max-w-[350px]",
            }}
          />
        </div>
      </div>
    </div>
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

  const filter = `contentType:"Sermon" AND sermonSeriesName:"${message.seriesTitle}" AND rockItemId != ${message.id}`;

  return (
    <InstantSearch
      indexName="dev_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure filters={filter} hitsPerPage={10} />
      <SeriesContent seriesTitle={message.seriesTitle} />
    </InstantSearch>
  );
};
