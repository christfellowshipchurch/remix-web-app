import { useLoaderData } from "@remix-run/react";
import { loader } from "./loader";
import { testimonialData } from "./locationsSingle.data";

//Partials
import { LocationsHero } from "./partials/hero.partial";
import { CampusInfo } from "./partials/campusInfo.partial";
import { SetAReminder } from "./partials/setAReminder.partial";
import { AtThisLocation } from "./partials/atThisLocation.partial";
import { Testimonials } from "./partials/testimonials.partial";
import { LocationFAQ } from "./partials/faq.partial";

export function LocationSinglePage() {
  const { data } = useLoaderData<typeof loader>();

  const { name } = data[0];
  return (
    <div className="w-full">
      <LocationsHero name={name} />
      <CampusInfo name={name} />
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
