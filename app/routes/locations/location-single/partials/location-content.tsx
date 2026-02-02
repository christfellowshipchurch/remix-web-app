import { CampusInfo } from "./campus-info.partial";
import { LocationFAQ } from "./faq.partial";
import { DynamicHero } from "~/components/dynamic-hero";
import { LocationHitType } from "../types";
import { CampusTabs } from "../components/tabs-component/campus-tabs.component";
import { AboutUs } from "./tabs/about-us";
import { SundayDetails } from "./tabs/sunday-details";
import { UpcomingEvents } from "./tabs/upcoming-events";
import { ForFamilies } from "./tabs/families";
import {
  englishTabData,
  onlineTabsData,
  spanishTabData,
} from "../location-single-data";
import { useResponsive } from "~/hooks/use-responsive";
import { ConnectWithUs } from "../components/tabs-component/about-us/connect-with-us";
import { useState, useEffect } from "react";
import { WhatToExpect } from "../components/tabs-component/sunday-details/what-to-expect";
import { useFetcher, useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";

function useResponsiveVideo(
  backgroundVideoMobile?: string,
  backgroundVideoDesktop?: string,
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
  const fetcher = useFetcher<{ isValid: boolean }>();

  const {
    campusName,
    campusLocation = undefined,
    campusImage,
    campusInstagram,
    campusPastor,
    digitalTourVideo = "",
    phoneNumber,
    serviceTimes,
    setReminderVideo: originalSetReminderVideo = "",
    weekdaySchedule = [],
    additionalInfo,
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;

  // Validate Wistia ID if it exists
  useEffect(() => {
    if (originalSetReminderVideo) {
      fetcher.load(
        `/validate-wistia?videoId=${encodeURIComponent(
          originalSetReminderVideo,
        )}`,
      );
    }
  }, [originalSetReminderVideo]);

  // Use validated video ID - only use it if validation passed
  // Don't render video while validation is in progress or if validation failed
  const setReminderVideo =
    originalSetReminderVideo &&
    fetcher.state === "idle" &&
    fetcher.data?.isValid === true
      ? originalSetReminderVideo
      : undefined;

  const wistiaId = useResponsiveVideo(
    backgroundVideoMobile,
    backgroundVideoDesktop,
  );

  const isOnline = campusName?.includes("Online");
  const isSpanish = campusName?.includes("Español");

  if (isOnline) {
    return <OnlineCampus hit={hit} />;
  }

  // Dynamic Hero Hardcoded Content / Data
  const heading1 = isSpanish ? "Este es un" : "You're";
  const heading2 = isSpanish ? "lugar para ti" : "welcome here";
  const ctas = [
    {
      title: isSpanish ? "Recuérdame" : "Set a Reminder",
      href: "#",
      isSetAReminder: true,
    },
    {
      title: isSpanish ? "Mapa y direcciones" : "Map & Directions",
      href: hit.mapLink || "#",
      target: "_blank",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <DynamicHero
        isSpanish={isSpanish}
        wistiaId={wistiaId}
        imagePath={campusImage}
        desktopHeight="800px"
        customTitle={`<h1 style='font-weight: 800;'><span style='color: #0092BC;'>${heading1}</span> <br/>${heading2}</h1>`}
        ctas={ctas}
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
        isSpanish={isSpanish}
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
  const fetcher = useFetcher<{ isValid: boolean }>();

  const {
    campusName,
    campusImage,
    campusInstagram,
    campusPastor,
    digitalTourVideo = "",
    setReminderVideo: originalSetReminderVideo = "",
    phoneNumber,
    serviceTimes,
    additionalInfo,
    backgroundVideoMobile,
    backgroundVideoDesktop,
  } = hit;

  // Validate Wistia ID if it exists
  useEffect(() => {
    if (originalSetReminderVideo) {
      fetcher.load(
        `/validate-wistia?videoId=${encodeURIComponent(
          originalSetReminderVideo,
        )}`,
      );
    }
  }, [originalSetReminderVideo]);

  // Use validated video ID - only use it if validation passed
  // Don't render video while validation is in progress or if validation failed
  const setReminderVideo =
    originalSetReminderVideo &&
    fetcher.state === "idle" &&
    fetcher.data?.isValid === true
      ? originalSetReminderVideo
      : undefined;

  const [activeTab, setActiveTab] = useState("sunday-details");

  const wistiaId = useResponsiveVideo(
    backgroundVideoMobile,
    backgroundVideoDesktop,
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
  isSpanish,
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
  isSpanish?: boolean;
  setActiveTab: (tab: string) => void;
  setReminderVideo: string | undefined;
  isOnline: boolean;
}) => {
  const { upcomingEvents } = useLoaderData<LoaderReturnType>();
  const hasUpcomingEvents = (upcomingEvents.collection?.length ?? 0) > 0;

  const defaultTabData = isOnline
    ? onlineTabsData
    : isSpanish
      ? spanishTabData
      : englishTabData;
  const tabData = hasUpcomingEvents
    ? defaultTabData
    : defaultTabData.filter((tab) => tab.value !== "upcoming-events");

  const activeTabValue = tabData.some((tab) => tab.value === activeTab)
    ? activeTab
    : "sunday-details";

  const tabs = [
    () => <SundayDetails isOnline={isOnline} isSpanish={isSpanish} />,
    () => <AboutUs campusPastor={campusPastor} isSpanish={isSpanish} />,
    ...(!isOnline ? [() => <ForFamilies isSpanish={isSpanish} />] : []),
    ...(hasUpcomingEvents ? [() => <UpcomingEvents />] : []),
  ];

  return (
    <div className="relative h-full w-full">
      {/* The SetAReminder buttons(inside WhatToExpect) conflict with the Radix tabs component, so we need to render them outside of the Tabs component*/}
      {activeTabValue === "sunday-details" && (
        <WhatToExpect
          setReminderVideo={setReminderVideo}
          isOnline={isOnline}
          isSpanish={isSpanish}
        />
      )}

      <CampusTabs
        activeTab={activeTabValue}
        isSpanish={isSpanish}
        setActiveTab={setActiveTab}
        tabs={tabs}
        tabData={tabData}
        isOnline={isOnline}
      />

      {/* The SetAReminder buttons(inside ConnectWithUs) conflict with the Radix tabs component, so we need to render them outside of the Tabs component*/}
      {activeTabValue === "about-us" && (
        <ConnectWithUs
          isSpanish={isSpanish}
          campusName={campusName || ""}
          campusInstagram={campusInstagram || ""}
        />
      )}
    </div>
  );
};
