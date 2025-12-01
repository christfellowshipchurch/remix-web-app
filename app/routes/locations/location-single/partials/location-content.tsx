import { CampusInfo } from "./campus-info.partial";
import { LocationFAQ } from "./faq.partial";
import { DynamicHero } from "~/components/dynamic-hero";
import { LocationHitType } from "../types";
import { CampusTabs } from "../components/tabs-component/campus-tabs.component";
import { AboutUs } from "./tabs/about-us";
import { SundayDetails } from "./tabs/sunday-details";
import { UpcomingEvents } from "./tabs/upcoming-events";
import { ForFamilies } from "./tabs/families";
import { useResponsive } from "~/hooks/use-responsive";

function useResponsiveVideo(
  backgroundVideoMobile?: string,
  backgroundVideoDesktop?: string
) {
  const { isSmall } = useResponsive();

  // On mobile: prefer mobile video, fallback to desktop
  // On desktop: prefer desktop video, fallback to mobile
  if (isSmall) {
    return backgroundVideoMobile || backgroundVideoDesktop;
  }
  return backgroundVideoDesktop || backgroundVideoMobile;
}

export function LocationSingle({ hit }: { hit: LocationHitType }) {
  if (!hit) {
    return <></>;
  }

  const {
    campusName,
    campusLocation = undefined,
    campusImage,
    campusInstagram,
    campusPastor,
    digitalTourVideo = "",
    phoneNumber,
    serviceTimes,
    setReminderVideo = "",
    weekdaySchedule = [],
    additionalInfo,
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;

  const wistiaId = useResponsiveVideo(
    backgroundVideoMobile,
    backgroundVideoDesktop
  );

  const isOnline = campusName?.includes("Online");
  if (isOnline) {
    return <OnlineCampus hit={hit} />;
  }

  return (
    <div className="w-full overflow-hidden">
      <DynamicHero
        wistiaId={wistiaId}
        imagePath={campusImage}
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
          (props: { setReminderVideo?: string; isOnline?: boolean }) => (
            <SundayDetails
              {...props}
              setReminderVideo={setReminderVideo || ""}
            />
          ),
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
    campusImage,
    campusInstagram,
    campusPastor,
    digitalTourVideo = "",
    phoneNumber,
    serviceTimes,
    additionalInfo,
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;

  const wistiaId = useResponsiveVideo(
    backgroundVideoMobile,
    backgroundVideoDesktop
  );

  return (
    <div className="w-full overflow-hidden">
      <DynamicHero
        wistiaId={wistiaId}
        imagePath={campusImage}
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
          (props) => <SundayDetails {...props} setReminderVideo="" />,
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
