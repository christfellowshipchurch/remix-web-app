import * as Tabs from "@radix-ui/react-tabs";
import { ComponentType, Fragment } from "react";
import { cn } from "~/lib/utils";

const tabData = [
  {
    label: "Sunday Details",
    mobileLabel: "Sunday",
    value: "sunday-details",
  },
  {
    label: "About Us",
    mobileLabel: "About",
    value: "about-us",
  },
  {
    label: "For Families",
    mobileLabel: "Families",
    value: "for-families",
  },
  {
    label: "Upcoming Events",
    mobileLabel: "Events",
    value: "upcoming-events",
  },
];

const OnlineTabsData = [
  {
    label: "Sunday Details",
    mobileLabel: "Sunday",
    value: "sunday-details",
  },
  {
    label: "About Us",
    mobileLabel: "About",
    value: "about-us",
  },
  {
    label: "Upcoming Events",
    mobileLabel: "Events",
    value: "upcoming-events",
  },
];

interface TabData {
  label: string;
  mobileLabel: string;
  value: string;
}

interface TabComponentProps {
  setReminderVideo?: string;
  isOnline?: boolean;
}

interface CampusTabsProps {
  tabs: Array<ComponentType<TabComponentProps>>;
  setReminderVideo?: string;
  isOnline?: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const tasListStyle =
  "absolute z-1 top-[-2rem] left-1/2 -translate-x-1/2 items-center justify-center rounded-[1rem] bg-white";

export const CampusTabs = ({
  activeTab = "sunday-details",
  setActiveTab,
  tabs,
  setReminderVideo,
  isOnline,
}: CampusTabsProps) => {
  return (
    <CustomTabs
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      data={isOnline ? OnlineTabsData : tabData}
      tabs={tabs}
      setReminderVideo={setReminderVideo}
      isOnline={isOnline}
    />
  );
};

const CustomTabs = ({
  activeTab,
  setActiveTab,
  data,
  tabs,
  setReminderVideo,
  isOnline,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  data: TabData[];
  tabs: ComponentType<TabComponentProps>[];
  setReminderVideo?: string;
  isOnline?: boolean;
}) => {
  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full flex flex-col justify-center items-center")}
    >
      {/* iPad/Desktop Tabs */}
      <Tabs.List
        className={cn(
          "flex gap-2 md:w-full md:gap-4 md:border border-neutral-lighter px-3 py-2 md:py-4 relative mt-15 md:mt-0",
          isOnline ? "max-w-[520px]" : "max-w-[668px]",
          tasListStyle,
          activeTab === "sunday-details" && "!absolute -top-9 left-1/2"
        )}
      >
        {data.map((tab, index) => (
          <Fragment key={`${tab.value}-${index}`}>
            {/* Desktop Tabs */}
            <Tabs.Trigger
              value={tab.value}
              className="hidden md:flex px-6 py-2 text-text-secondary font-bold data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[12px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer"
            >
              {tab.label}
            </Tabs.Trigger>

            {/* Mobile Tabs */}
            <Tabs.Trigger
              value={tab.value}
              className="md:hidden px-4 md:px-6 py-2 font-bold data-[state=active]:bg-navy-subdued rounded-[12px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer"
            >
              {tab.mobileLabel}
            </Tabs.Trigger>
          </Fragment>
        ))}
      </Tabs.List>

      <div className="w-full flex flex-col justify-center items-center">
        {data.map((tab, index) => {
          const TabComponent = tabs[index];
          return (
            <Tabs.Content
              key={index}
              value={tab.value}
              className="w-full data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300"
            >
              {TabComponent && (
                <TabComponent
                  setReminderVideo={setReminderVideo}
                  isOnline={isOnline}
                />
              )}
            </Tabs.Content>
          );
        })}
      </div>
    </Tabs.Root>
  );
};
