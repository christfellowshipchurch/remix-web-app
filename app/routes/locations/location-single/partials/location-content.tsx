import { CampusInfo } from "./campus-info.partial";
import { LocationFAQ } from "./faq.partial";
import { DynamicHero } from "~/components/dynamic-hero";
import { LocationHitType } from "../types";

export function LocationSingle({ hit }: { hit: LocationHitType }) {
  if (!hit) {
    return <></>;
  }

  const {
    campusName,
    campusLocation,
    digitalTourVideo,
    mapLink,
    mapUrl,
    phoneNumber,
    serviceTimes,
    setReminderVideo,
    weekdaySchedule,
    additionalInfo,
    // TODO: Fix desktop/mobile videos -> mobile is the desktop video??
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;
  const isEspanol = campusName?.includes("Español");

  return (
    <div className="w-full overflow-hidden">
      <DynamicHero
        wistiaId={backgroundVideoDesktop || backgroundVideoMobile}
        desktopHeight="800px"
        customTitle="<h1 style='font-weight: 800;'><span style='color: #0092BC;'>You're</span> <br/>welcome here</h1>"
        ctas={[
          { title: "Set a Reminder", href: "#", isSetAReminder: true },
          { title: "Map & Directions", href: "#" },
        ]}
      />
      <CampusInfo
        serviceTimes={serviceTimes}
        phoneNumber={phoneNumber}
        additionalInfo={additionalInfo}
        campusName={campusName}
        campusLocation={campusLocation}
        digitalTourVideo={digitalTourVideo}
        weekdaySchedule={weekdaySchedule}
      />
      <LocationFAQ campusName={campusName} />
    </div>
  );
}
