import { CampusInfo } from "./campus-info.partial";
import { LocationFAQ } from "./faq.partial";
import { DynamicHero } from "~/components/dynamic-hero";
import { LocationHitType } from "../types";
import { CampusTabs } from "../components/tabs-component/campus-tabs.component";
import { AboutUs } from "./tabs/about-us";
import { SundayDetails } from "./tabs/sunday-details";
import { UpcomingEvents } from "./tabs/upcoming-events";
import { ForFamilies } from "./tabs/families";

export function LocationSingle({ hit }: { hit: LocationHitType }) {
  if (!hit) {
    return <></>;
  }

  const {
    campusName,
    campusLocation = undefined,
    campusInstagram,
    campusPastor,
    digitalTourVideo = "",
    phoneNumber,
    serviceTimes,
    setReminderVideo = "",
    weekdaySchedule = [],
    additionalInfo,
    // TODO: Fix desktop/mobile videos -> mobile is the desktop video??
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;
  // TODO: Figure out Spanish campuses and their translations
  // const _isEspanol = campusName?.includes("Español");

  const isOnline = campusName?.includes("Online");
  if (isOnline) {
    return <OnlineCampus hit={hit} />;
  }

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
      <CampusTabs
        tabs={[
          SundayDetails,
          () => (
            <AboutUs
              campusPastor={campusPastor}
              campusName={campusName}
              campusInstagram={campusInstagram}
            />
          ),
          ForFamilies,
          UpcomingEvents,
        ]}
        setReminderVideo={setReminderVideo}
      />
      <LocationFAQ campusName={campusName} />
    </div>
  );
}

const OnlineCampus = ({ hit }: { hit: LocationHitType }) => {
  const {
    campusName,
    campusInstagram,
    campusPastor,
    digitalTourVideo = "",
    phoneNumber,
    serviceTimes,
    additionalInfo,
    // TODO: Fix desktop/mobile videos -> mobile is the desktop video??
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;

  return (
    <div className="w-full overflow-hidden">
      <DynamicHero
        wistiaId={backgroundVideoDesktop || backgroundVideoMobile}
        desktopHeight="800px"
        customTitle="<h1 style='font-weight: 800;'><span style='color: #0092BC;'>You're</span> <br/>welcome here</h1>"
        ctas={[
          { title: "Set a Reminder", href: "#", isSetAReminder: true },
          {
            title: "Watch Live",
            href: "https://www.youtube.com/user/christfellowship",
          },
        ]}
      />
      <CampusInfo
        serviceTimes={serviceTimes}
        phoneNumber={phoneNumber}
        additionalInfo={additionalInfo}
        campusName={campusName}
        digitalTourVideo={digitalTourVideo}
        isOnline={true}
      />
      <CampusTabs
        tabs={[
          SundayDetails,
          () => (
            <AboutUs
              campusPastor={campusPastor}
              campusName={campusName}
              campusInstagram={campusInstagram}
            />
          ),
          UpcomingEvents,
        ]}
        isOnline={true}
      />
      <LocationFAQ campusName={campusName} />
    </div>
  );
};
