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
import { ConnectWithUs } from "../components/tabs-component/about-us/connect-with-us";
import { useState } from "react";
import { WhatToExpect } from "../components/tabs-component/sunday-details/what-to-expect";

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

  const [activeTab, setActiveTab] = useState("sunday-details");

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

      <CampusTabsWrapper
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setReminderVideo={setReminderVideo}
        isOnline={false}
        campusPastor={campusPastor}
        campusName={campusName}
        campusInstagram={campusInstagram}
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
    setReminderVideo = "",
    phoneNumber,
    serviceTimes,
    additionalInfo,
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;

  const [activeTab, setActiveTab] = useState("sunday-details");

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

      <CampusTabsWrapper
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setReminderVideo={setReminderVideo}
        isOnline={true}
        campusPastor={campusPastor}
        campusName={campusName}
        campusInstagram={campusInstagram}
      />

      <LocationFAQ campusName={campusName} />
    </div>
  );
};

const CampusTabsWrapper = ({
  activeTab,
  campusPastor,
  campusName,
  campusInstagram,
  setActiveTab,
  setReminderVideo,
  isOnline,
}: {
  activeTab: string;
  campusPastor: {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  campusName: string;
  campusInstagram: string;
  setActiveTab: (tab: string) => void;
  setReminderVideo: string;
  isOnline: boolean;
}) => {
  return (
    <div className="relative h-full w-full">
      {/* The SetAReminder buttons(inside WhatToExpect) conflict with the Radix tabs component, so we need to render them outside of the Tabs component*/}
      {activeTab == "sunday-details" && (
        <WhatToExpect setReminderVideo={setReminderVideo} isOnline={isOnline} />
      )}

      <CampusTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          () => <SundayDetails isOnline={isOnline} />,
          () => <AboutUs campusPastor={campusPastor} />,
          ...(!isOnline ? [ForFamilies] : []),
          UpcomingEvents,
        ]}
        isOnline={isOnline}
      />

      {/* The SetAReminder buttons(inside ConnectWithUs) conflict with the Radix tabs component, so we need to render them oustide of the Tabs component*/}
      {activeTab == "about-us" && (
        <ConnectWithUs
          campusName={campusName || ""}
          campusInstagram={campusInstagram || ""}
        />
      )}
    </div>
  );
};
