import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import SectionTitle from "~/components/section-title";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";
import type { LoaderReturnType } from "../loader";

const CurrentSeries: React.FC = () => {
  const { currentSeries } = useLoaderData<LoaderReturnType>();
  const { currentSeriesTitle, latestMessage } = currentSeries;

  return (
    <section className="relative py-32 min-h-screen bg-white content-padding">
      {/* Light Blue Background - Bottom Half */}
      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-[#F3F5FA]" />

      {/* Content Container */}
      <div className="relative max-w-screen-content mx-auto">
        {/* Title Section */}
        <SectionTitle
          className="mb-8"
          sectionTitle="current series."
          title={currentSeriesTitle}
        />

        {/* Content Section */}
        <div className="relative w-full aspect-video">
          {/* Background Image */}
          <div
            className="lg:absolute lg:inset-0 w-full aspect-video lg:h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${latestMessage.coverImage}')`,
            }}
          />

          {/* Text Section */}
          <div className="lg:absolute bottom-0 left-0 w-full bg-white px-10 py-16 space-y-4 lg:w-[45%] md:max-h-[500px]">
            <h3 className="text-lg font-bold text-ocean">Latest Message</h3>
            <h2 className="text-[40px] font-bold text-text-primary text-pretty">
              {latestMessage.title}
            </h2>
            <p className="font-bold">{latestMessage.authorName}</p>
            <div className="text-gray-700 line-clamp-4 prose prose-p:my-0">
              <HTMLRenderer html={latestMessage.description} />
            </div>

            {/* Buttons */}
            <div className="mt-5 md:mt-0 flex flex-col md:flex-row gap-3">
              <Link to="/messages/series">
                <Button
                  intent="secondary"
                  className="font-semibold border-ocean rounded-none hover:enabled:bg-ocean/10 px-6 py-3"
                >
                  Series & Resources
                </Button>
              </Link>
              <div className="group">
                <Link to={latestMessage.path} className="flex">
                  <Button
                    intent="secondary"
                    className="font-semibold border-ocean rounded-none hover:enabled:bg-ocean/10"
                  >
                    Watch Message
                  </Button>
                  <Icon
                    name="arrowBack"
                    className="ml-[-0.75rem] text-white rounded-full bg-ocean p-2 rotate-[135deg] transition-transform duration-300 group-hover:rotate-180 size-10"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentSeries;
