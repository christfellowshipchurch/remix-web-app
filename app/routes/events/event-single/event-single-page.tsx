import React from "react";
import { useLoaderData } from "react-router-dom";

import { EventSinglePageType } from "./types";
import { EventsSingleHero } from "./partials/hero.partial";
import { EventSingleFAQ } from "./partials/event-faq.partial";
import { AboutPartial } from "./partials/about.partial";
import { EventBanner } from "./components/event-banner.component";
import { RegistrationSection } from "./partials/registration.partial";
import BackBanner from "~/components/back-banner";

export const EventSinglePage: React.FC = () => {
  const data = useLoaderData<EventSinglePageType>();

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
          optionalBlurb={data.optionalBlurb}
        />

        <EventSingleFAQ title={data.title} items={data.faqItems} />

        {data.sessionScheduleCards && data.sessionScheduleCards.length > 0 && (
          <RegistrationSection />
        )}
      </div>
    </>
  );
};
