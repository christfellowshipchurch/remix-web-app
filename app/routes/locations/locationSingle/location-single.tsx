import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "./loader";

//Partials
import { LocationsHero } from "./partials/hero.partial";
import { CampusInfo } from "./partials/campus-info.partial";
import { SetAReminder } from "./partials/set-a-reminder.partial";
import { Testimonials } from "./partials/testimonials.partial";
import { LocationFAQ } from "./partials/faq.partial";
import { testimonialData } from "./locations-single.data";
import { ComingUpSoon } from "./partials/coming-up-soon.partial";
import { LocationBlock } from "./partials/location-block.partial";

export function LocationSinglePage() {
  const { url } = useLoaderData<LoaderReturnType>();

  return (
    <div className="w-full">
      <LocationsHero />
      <CampusInfo />
      <SetAReminder />
      <Testimonials
        testimonies={
          url === "cf-everywhere"
            ? testimonialData.cfEverywhere
            : url.includes("iglesia")
            ? testimonialData.españolCampuses
            : testimonialData.default
        }
      />
      <LocationBlock />
      <ComingUpSoon />
      <LocationFAQ />
    </div>
  );
}
