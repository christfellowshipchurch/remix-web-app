import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { ComponentType, useState } from "react";
import { Icon } from "~/primitives/icon/icon";
import { cn } from "~/lib/utils";

const tabData = [
  {
    label: "Sunday Details",
    value: "sunday-details",
  },
  {
    label: "About Us",
    value: "about-us",
  },
  {
    label: "For Families",
    value: "for-families",
  },
  {
    label: "Upcoming Events",
    value: "upcoming-events",
  },
];

const OnlineTabsData = [
  {
    label: "Sunday Details",
    value: "sunday-details",
  },
  {
    label: "About Us",
    value: "about-us",
  },
  {
    label: "Upcoming Events",
    value: "upcoming-events",
  },
];

interface CampusTabsProps {
  tabs: ComponentType<any>[];
  setReminderVideo?: string;
  isOnline?: boolean;
}
const tasListStyle =
  "absolute z-1 top-[-2rem] left-1/2 -translate-x-1/2 items-center justify-center rounded-[1rem] bg-white";

export const CampusTabs = ({
  tabs,
  setReminderVideo,
  isOnline,
}: CampusTabsProps) => {
  return (
    <CustomTabs
      data={isOnline ? OnlineTabsData : tabData}
      tabs={tabs}
      setReminderVideo={setReminderVideo}
      isOnline={isOnline}
    />
  );
};

const CustomTabs = ({
  data,
  tabs,
  setReminderVideo,
  isOnline,
}: {
  data: any[];
  tabs: ComponentType<any>[];
  setReminderVideo?: string;
  isOnline?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState("sunday-details");

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-col justify-center items-center relative"
    >
      {/* iPad/Desktop Tabs */}
      <Tabs.List
        className={cn(
          "hidden md:flex gap-4 w-full border border-neutral-lighter p-4",
          isOnline ? "max-w-[520px]" : "max-w-[668px]",
          tasListStyle
        )}
      >
        {data.map((tab, index) => (
          <Tabs.Trigger
            key={index}
            value={tab.value}
            className="px-6 py-2 text-text-secondary font-bold data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[12px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* Mobile Tabs - Radix UI Select */}
      <MobileTabsDropdown
        data={data}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

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

const MobileTabsDropdown = ({
  activeTab,
  setActiveTab,
  data,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
  data: any[];
}) => {
  return (
    <div className={`w-3/4 md:hidden ${tasListStyle}`}>
      <Select.Root value={activeTab} onValueChange={setActiveTab}>
        <Select.Trigger
          className="w-full p-4 font-semibold border border-neutral-lighter rounded-[12px] bg-white flex items-center justify-between text-text-secondary focus:ring-2 focus:ring-ocean"
          aria-label="Select Tab"
        >
          <Select.Value />
          <Select.Icon asChild>
            <Icon name="chevronDown" size={24} className="text-ocean" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="z-50 mt-2 rounded-[12px] bg-white shadow-lg border border-neutral-lighter focus:outline-none"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-2">
              {data.map((tab) => (
                <Select.Item
                  key={tab.value}
                  value={tab.value}
                  className="px-4 py-2 rounded-md cursor-pointer text-text-secondary data-[state=checked]:bg-ocean data-[state=checked]:text-white font-semibold focus:bg-ocean focus:text-white outline-none"
                >
                  <Select.ItemText>{tab.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
