import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router";
import { TimesLocations } from "./components/times-and-locations.component";
import { EventContent } from "./partials/event-content.partial";
import SectionTitle from "~/components/section-title";
import { EventsSingleHero } from "./partials/hero.partial";
import { AdditionalResources } from "./components/additional-resources.component";
import { EventSingleFAQ } from "./components/faq.component";
import { InfoSection } from "./components/info-sections.component";

const mockResources = [
  {
    title: "Resource 1",
    image: "/assets/images/events/resource-1.jpg",
    url: "/resource-1",
  },
  {
    title: "Resource 2",
    image: "/assets/images/events/resource-2.jpg",
    url: "/resource-2",
  },
  {
    title: "Resource 3",
    image: "/assets/images/events/resource-3.jpg",
    url: "/resource-3",
  },
];

export const EventSinglePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <>
      <div className="flex flex-col items-center dark:bg-gray-900">
        {/* TODO: Get CTAS from Rock */}
        <EventsSingleHero
          imagePath={data.coverImage}
          ctas={[
            { title: "Invite", href: "#share" },
            { title: "Save My Spot", href: "#sign-up -> set-a-reminder" },
          ]}
          customTitle={data.title}
        />
        <div className="content-padding w-full flex flex-col items-center ">
          <div className="flex flex-col gap-12 w-full pt-16 pb-24 max-w-screen-content">
            <SectionTitle sectionTitle="event details." />
            <div className="flex w-full justify-center gap-16">
              <div className="hidden lg:block">
                <TimesLocations />
                <InfoSection type="blue" />
              </div>
              <div className="flex flex-col gap-16">
                <EventContent htmlContent={data.content} />
                <EventDivider className="hidden lg:block" />
                <div className="block lg:hidden">
                  {/* TODO: Get type from Rock */}
                  <TimesLocations />
                  <EventDivider />
                </div>
                <EventSingleFAQ />
                <EventDivider />
                {/* TODO: Get type from Rock */}
                <AdditionalResources type="cards" resources={mockResources} />
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
