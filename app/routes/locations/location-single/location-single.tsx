import { useLoaderData } from "react-router";
import { LoaderReturnType } from "./loader";

import { CampusInfo } from "./partials/campus-info.partial";
import { LocationFAQ } from "./partials/faq.partial";
import { DynamicHero } from "~/components/dynamic-hero";

export function LocationSinglePage() {
  const { name } = useLoaderData<LoaderReturnType>();
  const isEspanol = name?.includes("Español");
  const wistiaId = "x52lhugce3";

  return (
    <div className="w-full overflow-hidden">
      {/* TODO: Update to DynamicHero and allow it to have videos */}
      <DynamicHero
        wistiaId={wistiaId}
        desktopHeight="750px"
        customTitle="<h1 style='font-weight: 800;'><span style='color: #0092BC;'>You're</span> <br/>welcome here</h1>"
        ctas={[
          { title: "Set a Reminder", href: "#", isSetAReminder: true },
          { title: "Map & Directions", href: "#" },
        ]}
      />
      <CampusInfo />
      <LocationFAQ />
    </div>
  );
}
