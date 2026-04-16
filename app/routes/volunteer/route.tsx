import { VolunteerHero } from "./partials/volunteer-hero.partial";
import { VolunteerAtChurch } from "./partials/volunteer-church.partial";
import { VolunteerWhere } from "./partials/volunteer-where.partial";
import { VolunteerCommunity } from "./partials/volunteer-community.partial";
import { VolunteerGlobe } from "./partials/volunteer-globe.partial";
import { VolunteerStats } from "./partials/volunteer-stats.partial";
import { VolunteerTestimonials } from "./partials/volunteer-testimonials.partial";

export { loader } from "./loader";
export { meta } from "./meta";

function VolunteerPage() {
  return (
    <div>
      <VolunteerHero />
      <VolunteerWhere />
      <VolunteerAtChurch />
      <VolunteerCommunity />
      <VolunteerGlobe />
      <VolunteerStats />
      <VolunteerTestimonials />
      {/* Add ready to make a difference component here */}
    </div>
  );
}

export default VolunteerPage;
