import React from "react";
import { useLoaderData } from "react-router-dom";
import { SectionTitle } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";

import type { LoaderReturnType } from "../loader";
import { getFirstParagraph } from "~/lib/utils";
import kebabCase from "lodash/kebabCase";

const CurrentSeries: React.FC = () => {
  const { currentSeries } = useLoaderData<LoaderReturnType>();
  const { currentSeriesTitle, latestMessage } = currentSeries;

  const latestMessageResources = latestMessage.summary.includes("|")
    ? latestMessage.summary.split("|")[1]
    : null;

  return (
    <section className="relative grid grid-cols-1 min-h-screen lg:min-h-[900px] bg-white">
      {/* Content Container */}
      <div className="sm:h-[60vh] xl:h-[47vh] lg:min-h-[400px] w-full content-padding pt-14 md:pt-24 bg-gray sm:bg-white">
        {/* Title Section */}
        <div className="relative max-w-screen-content mx-auto">
          <SectionTitle
            className="mb-8"
            sectionTitle="current series."
            title={currentSeriesTitle}
          />
        </div>
      </div>
      <div className="sm:h-[40vh] xl:h-[53vh] lg:min-h-[450px] w-full bg-gray content-padding pt-64 pb-16 sm:pt-0">
        <div className="relative max-w-screen-content mx-auto">
          {/* Image Section */}
          <div
            className="absolute w-full aspect-video h-[40vh] sm:h-[40vh] lg:h-[65vh] xl:h-[65vh] -top-[40vh] sm:-top-[40vh] lg:top-auto lg:bottom-0 lg:min-h-[650px] bg-cover bg-center z-10"
            style={{
              backgroundImage: `url('${latestMessage.coverImage}')`,
            }}
          />
          {/* Text Section */}
          <div className="relative left-0 w-full bg-white px-10 py-10 xl:py-16 space-y-4 lg:w-[70%] xl:w-[45%] md:max-h-[525px] z-20">
            <h3 className="text-lg font-bold text-ocean">Latest Message</h3>
            <h2 className="text-[40px] font-bold text-text-primary text-pretty leading-tight">
              {latestMessage.title}
            </h2>
            <p className="font-bold">{latestMessage.authorName}</p>
            <div className="text-text-secondary line-clamp-4 xl:line-clamp-3 mb-6 lg:mb-3 xl:mb-12">
              {getFirstParagraph(latestMessage.description)}
            </div>

            {/* Buttons */}
            <div className="mt-5 xl:mt-8 md:mt-0 flex flex-col sm:flex-row gap-3">
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
        </div>
      </div>
    </section>
  );
};

export default CurrentSeries;
