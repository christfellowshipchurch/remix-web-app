import React from "react";
import { useLoaderData, useLocation } from "react-router-dom";

import { EventSinglePageType } from "./types";
import { EventsSingleHero } from "./partials/hero.partial";
import { EventSingleFAQ } from "./partials/event-faq.partial";
import { AboutPartial } from "./partials/about.partial";
import { EventBanner } from "./components/event-banner.component";
import { RegistrationSection } from "./partials/registration.partial";
import BackBanner from "~/components/back-banner";

export const EventSinglePage: React.FC = () => {
  const data = useLoaderData<EventSinglePageType>();
  const location = useLocation();

  // Valid groupTypes for ClickThroughRegistration
  const validGroupTypes = [
    "Kids Dedication",
    "Kids Starting Line",
    "Journey",
    "Baptism",
    "Dream Team Kickoff",
  ];

  // Check if sessionScheduleCards exist
  const hasSessionRegistration =
    data.sessionScheduleCards && data.sessionScheduleCards.length > 0;

  // Check if ClickThroughRegistration would be useful
  // It extracts groupType from the URL path (last part of path)
  // URL format: /events/kids or /events/baptism
  const pathParts = location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1] || "";
  const extractedGroupType = lastPart
    ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1)
    : "";

  // Handle "dream-team-kickoff" or "dream team kickoff" variations
  const normalizedGroupType = extractedGroupType
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const hasClickThroughRegistration =
    validGroupTypes.includes(normalizedGroupType);

  const showRegistration =
    hasSessionRegistration || hasClickThroughRegistration;

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
            ...(showRegistration
              ? [{ id: "register", label: "Register" }]
              : []),
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

        {data.faqItems && data.faqItems.length > 0 && (
          <EventSingleFAQ title={data.title} items={data.faqItems} />
        )}

        <RegistrationSection />
      </div>
    </>
  );
};
