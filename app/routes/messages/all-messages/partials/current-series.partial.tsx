import React, { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { IconButton } from "~/primitives/button/icon-button.primitive";

import type { AllMessagesLoaderReturnType } from "../loader";
import { getFirstParagraph } from "~/lib/utils";
import { SectionTitle } from "~/components";
import { ContentItemHit } from "~/routes/search/types";
import { Configure, InstantSearch, useHits } from "react-instantsearch";
import { createSearchClient } from "~/lib/create-search-client";

const CurrentSeries: React.FC = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<AllMessagesLoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  const [currentSeriesLoading, setCurrentSeriesLoading] = useState(true);

  return (
    <div className="bg-gray w-full content-padding py-28">
      <div className="flex flex-col gap-12 max-w-screen-content mx-auto">
        {currentSeriesLoading && <CurrentSeriesLoadingSkeleton />}
        <InstantSearch
          indexName="dev_contentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure filters={`contentType:"Sermon"`} hitsPerPage={1} />
          <CurrentSeriesHit setCurrentSeriesLoading={setCurrentSeriesLoading} />
        </InstantSearch>
      </div>
    </div>
  );
};

const CurrentSeriesHit = ({
  setCurrentSeriesLoading,
}: {
  setCurrentSeriesLoading: (currentSeriesLoading: boolean) => void;
}) => {
  const { items } = useHits<ContentItemHit>();

  useEffect(() => {
    if (items.length > 0) {
      setCurrentSeriesLoading(false);
    }
  }, [items]);

  if (items.length === 0) return null;

  const hit = items[0];
  const currentSeriesTitle = hit?.sermonSeriesName || "Current Series";

  const iconButtonClass =
    "text-text-primary border-text-primary hover:enabled:text-ocean hover:enabled:border-ocean lg:text-base xl:!text-lg";

  return (
    <>
      <SectionTitle title={currentSeriesTitle} sectionTitle="current series" />

      {/* Latest Message Card */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center size-full overflow-hidden rounded-[1rem] lg:h-[620px]">
        <div className="flex flex-col h-full lg:w-1/2 justify-between lg:justify-center lg:gap-16 bg-white w-full p-8 md:p-16 lg:px-10 lg:py-12 xl:p-16">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-extrabold text-ocean leading-none">
                Latest Message
              </h3>

              <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-pretty">
                {hit.title}
              </h2>
              <p className="-mt-1 font-semibold">
                {hit.author.firstName} {hit.author.lastName}
              </p>
            </div>

            <div className="text-text-secondary line-clamp-4 xl:line-clamp-3 mb-6 lg:mb-0">
              {hit.summary || getFirstParagraph(hit.htmlContent || "")}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 lg:mt-0 flex flex-col sm:flex-row gap-3 sm:gap-4 xl:gap-8">
            {hit.sermonSeriesGuid && (
              <IconButton
                to={`/series-resources/${hit.sermonSeriesGuid}`}
                className={iconButtonClass}
              >
                Series & Resources
              </IconButton>
            )}
            <IconButton
              to={`/messages/${hit.url}`}
              prefetch="viewport"
              withRotatingArrow
              className={iconButtonClass}
            >
              Watch Message
            </IconButton>
          </div>
        </div>

        <img
          src={hit.coverImage.sources[0].uri}
          alt={currentSeriesTitle}
          className="w-full lg:w-1/2 lg:h-[620px] object-cover"
        />
      </div>
    </>
  );
};

const CurrentSeriesLoadingSkeleton = () => {
  return (
    <>
      <SectionTitle title="Current Series" sectionTitle="current series" />
      <div className="size-full rounded-[1rem] lg:h-[620px] xl:h-[540px] 2xl:h-[500px] bg-white animate-pulse" />
    </>
  );
};

export default CurrentSeries;
