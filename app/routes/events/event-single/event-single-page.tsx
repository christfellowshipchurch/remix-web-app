import React from "react";
import { useLoaderData } from "react-router-dom";

import { EventSinglePageType } from "./types";
import { EventsSingleHero } from "./partials/hero.partial";
import { EventSingleFAQ } from "./partials/event-faq.partial";
import { AboutPartial } from "./partials/about.partial";
import { ResgisterPartial } from "./partials/register.partial";
import { EventBanner } from "./components/event-banner";
import BackBanner from "~/components/back-banner";

export const EventSinglePage: React.FC = () => {
  const data = useLoaderData<EventSinglePageType>();

  const shouldRegister = false;

  return (
    <>
      <div className="flex flex-col items-center bg-white">
        <BackBanner
          backText="Back to Events"
          pageTitle={data.title}
          link="/events"
        />

        <EventsSingleHero
          imagePath={data.coverImage}
          ctas={data.heroCtas}
          customTitle={data.title}
          subtitle={data.subtitle}
          quickPoints={data.quickPoints}
        />

        <EventBanner
          title={data.title}
          cta={data.heroCtas[0]}
          sections={[
            { id: "about", label: "About" },
            { id: "faq", label: "FAQ" },
            // { id: "register", label: "Register" },
          ]}
        />

        <AboutPartial
          aboutTitle={data.aboutTitle}
          aboutContent={data.aboutContent}
          infoCards={data.keyInfoCards}
          whatToExpect={data.whatToExpect}
          moreInfo={data.moreInfo ?? ""}
          additionalBlurb={data.additionalBlurb}
        />

        <EventSingleFAQ title={data.title} items={data.faqItems} />

        {/* Register Section - TODO: NOT COMPLETED, PAUSING FOR NOW*/}
        {shouldRegister && <ResgisterPartial title={data.title} />}
      </div>
    </>
  );
};
