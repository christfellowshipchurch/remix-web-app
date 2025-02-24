import { useLoaderData } from "react-router";
import { LoaderReturnType } from "./loader";

//Partials
import { LocationsHero } from "./partials/hero.partial";
import { CampusInfo } from "./partials/campus-info.partial";
import { SetAReminder } from "./partials/set-a-reminder.partial";
import { Testimonials } from "./partials/testimonials.partial";
import { LocationFAQ } from "./partials/faq.partial";
import { ComingUpSoon } from "./partials/coming-up-soon.partial";
import { LocationBlock } from "./partials/location-block.partial";
import { TodaLaSemana } from "./partials/spanish/toda-la-semana.partial";
import { ThisWeek } from "./partials/this-week";

export function LocationSinglePage() {
  const { name } = useLoaderData<LoaderReturnType>();
  const isEspanol = name?.includes("Español");

  return (
    <div className="w-full overflow-hidden">
      <LocationsHero />
      <CampusInfo />
      {name === "Online (CF Everywhere)" && <ThisWeek />}
      <SetAReminder />
      <Testimonials />
      {isEspanol ? <TodaLaSemana /> : <LocationBlock />}
      <ComingUpSoon />
      <LocationFAQ />
    </div>
  );
}
