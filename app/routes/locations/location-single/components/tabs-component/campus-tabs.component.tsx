import * as Tabs from "@radix-ui/react-tabs";
import { ComponentType, Fragment } from "react";
import { cn } from "~/lib/utils";
import {
  englishTabData,
  onlineTabsData,
  spanishTabData,
} from "../../location-single-data";

type TabData = {
  label: string;
  mobileLabel: string;
  value: string;
};

interface TabComponentProps {
  setReminderVideo?: string;
  isOnline?: boolean;
}

interface CampusTabsProps {
  tabs: Array<ComponentType<TabComponentProps>>;
  tabData?: TabData[];
  setReminderVideo?: string;
  isOnline?: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSpanish?: boolean;
}
const tasListStyle =
  "absolute z-1 top-[-2rem] left-1/2 -translate-x-1/2 items-center justify-center rounded-[1rem] bg-white";

export const CampusTabs = ({
  activeTab = "sunday-details",
  setActiveTab,
  tabs,
  tabData,
  setReminderVideo,
  isOnline,
  isSpanish,
}: CampusTabsProps) => {
  const defaultData = isOnline
    ? onlineTabsData
    : isSpanish
      ? spanishTabData
      : englishTabData;
  const data = tabData ?? defaultData;
  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full flex flex-col justify-center items-center")}
    >
      {/* Desktop Tabs */}
      <Tabs.List
        className={cn(
          "flex max-w-[90vw] md:max-w-none lg:w-auto md:gap-4 md:border border-neutral-lighter px-3 py-2 md:py-4 relative mt-15 md:mt-0",
          isSpanish ? "gap-0 text-[14.5px] sm:text-base" : "gap-2",
          tasListStyle,
          activeTab === "sunday-details" && "!absolute -top-9 left-1/2",
        )}
      >
        {data.map((tab, index) => (
          <Fragment key={`${tab.value}-${index}`}>
            {/* Desktop Tabs */}
            <Tabs.Trigger
              value={tab.value}
              className="hidden lg:flex px-6 py-2 text-text-secondary font-bold data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[12px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer"
            >
              {tab.label}
            </Tabs.Trigger>

            {/* Mobile Tabs */}
            <Tabs.Trigger
              value={tab.value}
              className="lg:hidden px-4 md:px-6 py-2 font-bold data-[state=active]:bg-navy-subdued rounded-[12px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer"
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
