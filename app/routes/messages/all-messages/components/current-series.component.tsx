import React from "react";
import { useLoaderData } from "react-router-dom";
import { IconButton } from "~/primitives/button/icon-button.primitive";

import type { LoaderReturnType } from "../loader";
import { getFirstParagraph } from "~/lib/utils";
import kebabCase from "lodash/kebabCase";
import { SectionTitle } from "~/components";

const CurrentSeries: React.FC = () => {
  const { currentSeries } = useLoaderData<LoaderReturnType>();
  const { currentSeriesTitle, latestMessage } = currentSeries;

  const latestMessageResources = latestMessage.messageSeries;

  return (
    <div className="bg-gray w-full content-padding py-28">
      <div className="flex flex-col gap-12 max-w-screen-content mx-auto">
        <SectionTitle
          title={currentSeriesTitle}
          sectionTitle="current series"
        />

        <div className="flex flex-col-reverse lg:flex-row items-center justify-center size-full overflow-hidden rounded-[1rem] lg:h-[620px] xl:h-[540px] 2xl:h-[500px]">
          <div className="flex flex-col h-full lg:w-1/2 justify-between bg-white w-full p-8 md:p-16">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-ocean">Latest Message</h3>
              <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-text-primary text-pretty leading-tight">
                {latestMessage.title}
              </h2>
              <p className="font-bold">{latestMessage.authorName}</p>
              <div className="text-text-secondary line-clamp-4 xl:line-clamp-3 mb-6 lg:mb-0">
                {getFirstParagraph(latestMessage.description)}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 lg:mt-0 flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8">
              {latestMessageResources && (
                <IconButton
                  to={`/series-resources/${kebabCase(latestMessageResources)}`}
                  className="text-text-primary border-text-primary hover:enabled:text-ocean hover:enabled:border-ocean"
                >
                  Series & Resources
                </IconButton>
              )}
              <IconButton
                to={`/messages/${latestMessage.path}`}
                prefetch="viewport"
                withRotatingArrow
                className="text-text-primary border-text-primary hover:enabled:text-ocean hover:enabled:border-ocean"
              >
                Watch Message
              </IconButton>
            </div>
          </div>

          <img
            src={latestMessage.coverImage}
            alt={currentSeriesTitle}
            className="w-full lg:w-1/2 lg:h-[620px] xl:h-[500px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentSeries;
