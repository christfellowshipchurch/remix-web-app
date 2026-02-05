import { DynamicHero } from "~/components";

import { VolunteerAtChurch } from "./partials/volunteer-church.partial";
import { VolunteerWhere } from "./partials/volunteer-where.partial";
import { VolunteerCommunity } from "./partials/volunteer-community.partial";
import { VolunteerGlobe } from "./partials/volunteer-globe.partial";
import { OnboardingProcess } from "./partials/volunteer-onboarding.partial";
import { VolunteerStats } from "./partials/volunteer-stats.partial";
import { VolunteerFeaturedEvent } from "./partials/volunteer-feature-event.partial";
import { VolunteerTestimonials } from "./partials/volunteer-testimonials.partial";

export { loader } from "./loader";
export { meta } from "./meta";

function VolunteerPage() {
  return (
    <div>
      <DynamicHero
        imagePath="/assets/images/volunteer/hero.webp"
        customTitle={`<span style='color:#0092BC'>Volunteer</span> Locally<br />& Globally`}
        ctas={[{ href: "#opportunities", title: "Discover how to serve" }]}
      />

      <VolunteerWhere />
      <VolunteerAtChurch />
      <VolunteerCommunity />
      <VolunteerGlobe />
      <OnboardingProcess />
      <VolunteerStats />
      <VolunteerFeaturedEvent />
      <VolunteerTestimonials />
    </div>
  );
}

export default VolunteerPage;
