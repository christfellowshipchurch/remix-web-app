import React, { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { IconButton } from "~/primitives/button/icon-button.primitive";

import type { LoaderReturnType } from "../loader";
import { getFirstParagraph } from "~/lib/utils";
import kebabCase from "lodash/kebabCase";
import { SectionTitle } from "~/components";
import { ContentItemHit } from "~/routes/search/types";
import { Configure, InstantSearch, useHits } from "react-instantsearch";
import { createSearchClient } from "./all-messages.component";

const CurrentSeries: React.FC = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <div className="bg-gray w-full content-padding py-28">
      <div className="flex flex-col gap-12 max-w-screen-content mx-auto">
        <InstantSearch
          indexName="dev_daniel_contentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure filters={`contentType:"Sermon"`} hitsPerPage={1} />
          <CurrentSeriesHit />
        </InstantSearch>
      </div>
    </div>
  );
};

const CurrentSeriesHit = () => {
  const { items } = useHits<ContentItemHit>();
  if (items.length === 0) return null;

  const currentSeriesTitle = items[0]?.seriesName || "Current Series";
  const hit = items[0];

  return (
    <>
      <SectionTitle title={currentSeriesTitle} sectionTitle="current series" />

      {/* Latest Message Card */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center size-full overflow-hidden rounded-[1rem] lg:h-[620px] xl:h-[540px] 2xl:h-[500px]">
        <div className="flex flex-col h-full lg:w-1/2 justify-between bg-white w-full p-8 md:p-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-ocean">Latest Message</h3>
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-text-primary text-pretty leading-tight">
              {hit.title}
            </h2>
            <p className="font-bold">
              {hit.author.firstName} {hit.author.lastName}
            </p>
            <div className="text-text-secondary line-clamp-4 xl:line-clamp-3 mb-6 lg:mb-0">
              {getFirstParagraph(hit.summary)}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 lg:mt-0 flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8">
            {hit.seriesGuid && (
              <IconButton
                to={`/series-resources/${kebabCase(hit.seriesGuid)}`}
                className="text-text-primary border-text-primary hover:enabled:text-ocean hover:enabled:border-ocean"
              >
                Series & Resources
              </IconButton>
            )}
            <IconButton
              to={`/messages/${hit.url}`}
              prefetch="viewport"
              withRotatingArrow
              className="text-text-primary border-text-primary hover:enabled:text-ocean hover:enabled:border-ocean"
            >
              Watch Message
            </IconButton>
          </div>
        </div>

        <img
          src={hit.coverImage.sources[0].uri}
          alt={currentSeriesTitle}
          className="w-full lg:w-1/2 lg:h-[620px] xl:h-[500px] object-cover"
        />
      </div>
    </>
  );
};

export default CurrentSeries;
