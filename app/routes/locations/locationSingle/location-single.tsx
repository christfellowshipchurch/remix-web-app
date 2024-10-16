import { useLoaderData } from "@remix-run/react";
import { loader } from "./loader";
import { testimonialData } from "./locations-single.data";

//Partials
import { LocationsHero } from "./partials/hero.partial";
import { CampusInfo } from "./partials/campus-info.partial";
import { SetAReminder } from "./partials/set-a-reminder.partial";
import { AtThisLocation } from "./partials/at-this-location.partial";
import { Testimonials } from "./partials/testimonials.partial";
import { LocationFAQ } from "./partials/faq.partial";
import { createImageUrlFromGuid } from "~/lib/utils";

export function LocationSinglePage() {
  const { data } = useLoaderData<typeof loader>();
  if (data?.length === 0) {
    // displays a 404 page
    throw new Response("Not Found", { status: 404 });
  }

  // TODO: Way to access data in parents? so no need to pass it down so much??
  const { name, attributeValues } = data[0];
  return (
    <div className="w-full">
      <LocationsHero name={name} />
      <CampusInfo
        name={name}
        campusMap={createImageUrlFromGuid(
          attributeValues?.campusMapImage?.value
        )}
      />
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
