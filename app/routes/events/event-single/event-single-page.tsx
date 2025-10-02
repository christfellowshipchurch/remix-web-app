import React from "react";
import { useLoaderData } from "react-router-dom";

import { LoaderReturnType } from "./loader";
import { EventsSingleHero } from "./partials/hero.partial";
import { EventSingleFAQ } from "./components/event-single-faq.component";
import BackBanner from "~/components/back-banner";
import { EventBanner } from "./components/event-banner";
import { AboutPartial } from "./partials/about.partial";
import { ResgisterPartial } from "./partials/register.partial";

export const EventSinglePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  // TODO: Update this to come from loader? - looking into this more in the future
  const shouldRegister = false;

  // TODO: Get CTAS from loader
  const mockCtas = [
    { title: "Invite", href: "#share" },
    { title: "Save My Spot", href: "#sign-up -> set-a-reminder" },
  ];

  return (
    <>
      <div className="flex flex-col items-center dark:bg-gray-900">
        <BackBanner
          backText="Back to Events"
          pageTitle={data.title}
          link="/events"
        />

        <EventsSingleHero
          imagePath={data.coverImage}
          ctas={mockCtas}
          customTitle={data.title}
        />

        <EventBanner
          title={data.title}
          cta={mockCtas[0]} // For now just pass the first CTA, not sure if we want this to be the way to figure this button out
          sections={[
            { id: "about", label: "About" },
            { id: "faq", label: "FAQ" },
            // { id: "register", label: "Register" },
          ]}
        />

        {/* About Section - TODO: Pending how to get the data being hardcoded now */}
        <AboutPartial
          moreInfo="One to two warm sentences offering an invite to the event with an inline link to a form. Or just an example sentence that you could use to invite a friend that the user can copy and paste. Additional details such as anything they need to bring or is provided that may not have been listed above."
          additionalBlurb="Optional Extra Blurb? You can use this blurb for special audiences, such as: Those new to faith who might have an additional call to action. Certain events, unique features like childcare, guest speakers, or accessibility details"
          infoCards={[
            {
              title: "Key Info Card",
              description:
                "Each card should have: An icon, A title and A description",
              icon: "star",
            },
            {
              title: "Key Info Card",
              description:
                "Each card should have: An icon, A title and A description",
              icon: "star",
            },
            {
              title: "Key Info Card",
              description:
                "Each card should have: An icon, A title and A description",
              icon: "star",
            },
          ]}
        />

        {/* FAQ Section */}
        <EventSingleFAQ title={data.title} />

        {/* Register Section - TODO: NOT COMPLETED, PAUSING FOR NOW*/}
        {shouldRegister && <ResgisterPartial title={data.title} />}
      </div>
    </>
  );
};
