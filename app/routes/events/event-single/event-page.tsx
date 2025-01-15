import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router";
import { DynamicHero } from "~/components/dynamic-hero";
import StyledAccordion from "~/components/styled-accordion";
import { faqEventData } from "~/lib/faq-data.data";
import { TimesLocations } from "./partials/times-and-locations";
import { EventContent } from "./partials/event-content.partial";
import SectionTitle from "~/components/section-title";

export const EventPage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <>
      <section className="flex flex-col items-center dark:bg-gray-900">
        {/* TODO: Get CTAS from Rock */}
        <DynamicHero
          imagePath={data.coverImage}
          ctas={[
            { title: "Invite", href: "#share" },
            { title: "Save My Spot", href: "#sign-up -> set-a-reminder" },
          ]}
          customTitle={data.title}
        />
        <div className="flex flex-col gap-12 w-full pt-16 pb-24 max-w-[1440px] px-8">
          <SectionTitle sectionTitle="event details." />
          <div className="flex w-full justify-center gap-16">
            <TimesLocations />
            <div className="flex flex-col gap-16">
              <EventContent htmlContent={data.content} />
              <div className="flex flex-col gap-12">
                <h2 className="font-extrabold text-4xl">
                  Frequently Asked Questions
                </h2>
                <StyledAccordion
                  data={faqEventData}
                  bg="white"
                  border="#C6C6C6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
