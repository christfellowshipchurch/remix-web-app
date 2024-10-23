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
import { TodaLaSemana } from "./partials/spanish/toda-la-semana.partial";

export function LocationSinglePage() {
  const { name } = useLoaderData<LoaderReturnType>();
  const cfe = name?.includes("Español");

  return (
    <div className="w-full">
      <LocationsHero />
      <CampusInfo />
      <SetAReminder />
      <Testimonials
        testimonies={
          name === "Online (CF Everywhere)"
            ? testimonialData.cfEverywhere
            : cfe
            ? testimonialData.españolCampuses
            : testimonialData.default
        }
      />
      {cfe ? <TodaLaSemana /> : <LocationBlock />}
      <ComingUpSoon />
      <LocationFAQ />
    </div>
  );
}
