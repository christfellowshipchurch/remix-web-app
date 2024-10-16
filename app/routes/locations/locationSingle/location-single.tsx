import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "./loader";
import { testimonialData } from "./locations-single.data";

//Partials
import { LocationsHero } from "./partials/hero.partial";
import { CampusInfo } from "./partials/campus-info.partial";
import { SetAReminder } from "./partials/set-a-reminder.partial";
import { AtThisLocation } from "./partials/at-this-location.partial";
import { Testimonials } from "./partials/testimonials.partial";
import { LocationFAQ } from "./partials/faq.partial";

export function LocationSinglePage() {
  const { name } = useLoaderData<LoaderReturnType>();

  return (
    <div className="w-full">
      <LocationsHero name={name} />
      <CampusInfo />
      <SetAReminder />
      <Testimonials
        testimonies={
          name === "cf-everywhere"
            ? testimonialData.cfEverywhere
            : name.includes("iglesia")
            ? testimonialData.españolCampuses
            : testimonialData.default
        }
      />
      <AtThisLocation name={name} />
      <LocationFAQ name={name} />
    </div>
  );
}
