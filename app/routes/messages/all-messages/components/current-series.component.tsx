import React from "react";
import { useLoaderData } from "react-router-dom";
import { SectionTitle } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";

import type { LoaderReturnType } from "../loader";
import { getFirstParagraph } from "~/lib/utils";

const CurrentSeries: React.FC = () => {
  const { currentSeries } = useLoaderData<LoaderReturnType>();
  const { currentSeriesTitle, latestMessage } = currentSeries;

  return (
    <section className="relative grid grid-cols-1 min-h-screen bg-white">
      {/* Content Container */}
      <div className="h-[50vh] w-full content-padding pt-24">
        {/* Title Section */}
        <div className="relative max-w-screen-content mx-auto">
          <SectionTitle
            className="mb-8"
            sectionTitle="current series."
            title={currentSeriesTitle}
          />
        </div>
      </div>
      <div className="h-[50vh] w-full bg-gray content-padding">
        <div className="relative max-w-screen-content mx-auto">
          {/* Image Section */}
          <div
            className="absolute w-full aspect-video h-[70vh] bottom-0 bg-cover bg-center z-10"
            style={{
              backgroundImage: `url('${latestMessage.coverImage}')`,
            }}
          />
          {/* Text Section */}
          <div className="relative left-0 w-full bg-white px-10 py-10 space-y-4 md:w-[75%] xl:w-[45%] md:max-h-[525px] z-20">
            <h3 className="text-lg font-bold text-ocean">Latest Message</h3>
            <h2 className="text-[40px] font-bold text-text-primary text-pretty leading-tight">
              {latestMessage.title}
            </h2>
            <p className="font-bold">{latestMessage.authorName}</p>
            <div className="text-text-secondary line-clamp-4 xl:line-clamp-3 mb-6 lg:mb-3 xl:mb-12">
              {getFirstParagraph(latestMessage.description)}
            </div>

            {/* Buttons */}
            <div className="mt-5 md:mt-0 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              <IconButton
                to="/messages/series"
                className="text-text-primary border-text-primary hover:enabled:text-ocean hover:enabled:border-ocean"
              >
                Series & Resources
              </IconButton>
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
