import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router";
import { DynamicHero } from "~/components/dynamic-hero";
import StyledAccordion from "~/components/styled-accordion";
import { faqEventData } from "~/lib/faqData";
import { EventDetails } from "./partials/event-details.partial";
import { EventContent } from "./partials/event-content.partial";

export const EventPage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <>
      <section className="flex flex-col items-center bg-gradient-to-b from-white to-background_to dark:bg-gray-900">
        {/* TODO: Get CTAS from Rock */}
        <DynamicHero
          imagePath={data.coverImage}
          ctas={[
            { title: "Invite", href: "#share" },
            { title: "Save My Spot", href: "#sign-up -> set-a-reminder" },
          ]}
          customTitle={data.title}
        />
        <div className="flex w-full justify-center gap-16 pt-16 pb-24 max-w-[1440px]">
          <EventDetails />
          <div className="flex flex-col gap-16">
            <EventContent htmlContent={data.content} />
            <StyledAccordion data={faqEventData} />
          </div>
        </div>
      </section>
    </>
  );
};
