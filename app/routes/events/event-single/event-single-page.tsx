import React from "react";
import { useLoaderData } from "react-router-dom";

import { LoaderReturnType } from "./loader";
import { EventContent } from "./partials/event-content.partial";
import { EventsSingleHero } from "./partials/hero.partial";
import { TimesLocations } from "./components/times-and-locations.component";
import { EventSingleFAQ } from "./components/event-single-faq.component";
import { AdditionalInfo } from "./components/info-sections.component";
import BackBanner from "~/components/back-banner";
import { EventBanner } from "./components/event-banner";

export const EventSinglePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <>
      <div className="flex flex-col items-center dark:bg-gray-900">
        <BackBanner
          backText="Back to Events"
          pageTitle={data.title}
          link="/events"
        />

        {/* TODO: Get CTAS from Rock */}
        <EventsSingleHero
          imagePath={data.coverImage}
          ctas={[
            { title: "Invite", href: "#share" },
            { title: "Save My Spot", href: "#sign-up -> set-a-reminder" },
          ]}
          customTitle={data.title}
        />

        <EventBanner title={data.title} />

        {/* About Section */}
        <EventSingleFAQ title={data.title} />
        {/* Register Section */}

        {/* TODO: Remove OLD - Content Sections */}
        <div className="content-padding w-full flex flex-col items-center ">
          <div className="flex flex-col gap-12 w-full pt-16 pb-24 max-w-screen-content">
            <div className="flex w-full justify-center gap-16">
              {/* Desktop */}
              <div className="hidden lg:flex flex-col gap-8">
                <TimesLocations />
                {/* Placeholder for Additional Info Sections - Will be completed once design team has provided the content/use cases */}
                <AdditionalInfo type="contact" />
              </div>
              <div className="flex flex-col gap-16">
                <EventContent htmlContent={data.content} />
                <EventDivider className="hidden lg:block" />

                {/* Mobile */}
                <div className="flex flex-col gap-8 lg:hidden">
                  <TimesLocations />
                  <EventDivider />
                  <AdditionalInfo type="contact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EventDivider = ({ className }: { className?: string }) => {
  return <div className={`w-full h-[1px] bg-black opacity-30 ${className}`} />;
};
