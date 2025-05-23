import { useLoaderData } from "react-router";
import { LoaderReturnType } from "./loader";

import { CampusInfo } from "./partials/campus-info.partial";
import { LocationFAQ } from "./partials/faq.partial";
import { LocationsHero } from "./partials/hero.partial";

export function LocationSinglePage() {
  const { name } = useLoaderData<LoaderReturnType>();
  const isEspanol = name?.includes("Español");
  const bgVideoId = "800000000";
  return (
    <div className="w-full overflow-hidden">
      <LocationsHero
        bgVideo={bgVideoId}
        ctas={[
          { title: "Set a Reminder", href: "#" },
          { title: "Map & Directions", href: "#" },
        ]}
      />
      <CampusInfo />
      <LocationFAQ />
    </div>
  );
}
