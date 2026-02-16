import React, { useEffect } from "react";
import { useLoaderData, useLocation } from "react-router-dom";

import { EventSinglePageType } from "./types";
import { EventsSingleHero } from "./partials/hero.partial";
import { EventSingleFAQ } from "./partials/event-faq.partial";
import { AboutPartial } from "./partials/about.partial";
import { EventBanner } from "./components/event-banner.component";
import { RegistrationSection } from "./partials/registration.partial";
import BackBanner from "~/components/back-banner";

const SECTION_IDS = ["about", "faq", "register"] as const;

export const EventSinglePage: React.FC = () => {
  const data = useLoaderData<EventSinglePageType>();
  const location = useLocation();

  // Scroll to section when landing with a hash (e.g. /events/baptism#register)
  useEffect(() => {
    const hash = location.hash?.slice(1);
    if (!hash || !SECTION_IDS.includes(hash as (typeof SECTION_IDS)[number]))
      return;
    const el = document.getElementById(hash);
    if (!el) return;
    const offsetTop = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  }, [location.hash]);

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

  const aboutInformationExists =
    (data.aboutTitle && data.aboutTitle !== "") ||
    (data.aboutContent && data.aboutContent !== "") ||
    (data.keyInfoCards && data.keyInfoCards.length > 0) ||
    (data.whatToExpect && data.whatToExpect.length > 0) ||
    (data.moreInfoTitle && data.moreInfoTitle !== "") ||
    (data.optionalBlurb && data.optionalBlurb.length > 0);

  return (
    <>
      <div className="flex flex-col items-center bg-white">
        <BackBanner
          backText="Back to Events"
          pageTitle={data.title}
          link={
            typeof location.state?.fromEvents === "string"
              ? location.state.fromEvents
              : "/events"
          }
        />

        <EventsSingleHero
          imagePath={data.coverImage}
          ctas={data.heroCtas}
          customTitle={data.titleOverride || data.title}
          subtitle={data.subtitle}
          quickPoints={data.quickPoints}
        />

        <EventBanner
          title={data.title}
          cta={data.heroCtas[0]}
          sections={[
            ...(aboutInformationExists
              ? [{ id: "about", label: "About" }]
              : []),
            ...(data.faqItems && data.faqItems.length > 0
              ? [{ id: "faq", label: "FAQ" }]
              : []),
            ...(showRegistration
              ? [{ id: "register", label: "Register" }]
              : []),
          ]}
        />

        {aboutInformationExists && (
          <AboutPartial
            aboutTitle={data.aboutTitle}
            aboutContent={data.aboutContent}
            infoCards={data.keyInfoCards}
            whatToExpect={data.whatToExpect}
            moreInfoTitle={data.moreInfoTitle}
            moreInfoText={data.moreInfoText}
            optionalBlurb={data.optionalBlurb}
          />
        )}

        {data.faqItems && data.faqItems.length > 0 && (
          <EventSingleFAQ title={data.title} items={data.faqItems} />
        )}

        <RegistrationSection />
      </div>
    </>
  );
};
