import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { ComponentType, useState } from "react";
import { Icon } from "~/primitives/icon/icon";

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

interface CampusTabsProps {
  tabs: ComponentType<any>[];
  setReminderVideo: string;
}
const tasListStyle =
  "absolute top-[-2rem] left-1/2 -translate-x-1/2 items-center justify-center rounded-[1rem] bg-white";

export const CampusTabs = ({ tabs, setReminderVideo }: CampusTabsProps) => {
  const [activeTab, setActiveTab] = useState("sunday-details");

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-coljustify-center relative"
    >
      {/* iPad/Desktop Tabs */}
      <Tabs.List
        className={`hidden md:flex gap-4 w-full max-w-[668px] border border-neutral-lighter p-4 ${tasListStyle}`}
      >
        {tabData.map((tab, index) => (
          <Tabs.Trigger
            key={index}
            value={tab.value}
            className="px-6 py-2 text-text-secondary font-bold data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[12px]"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* Mobile Tabs - Radix UI Select */}
      <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="w-full flex flex-col justify-center items-center">
        {tabData.map((tab, index) => {
          const TabComponent = tabs[index];
          return (
            <Tabs.Content key={index} value={tab.value} className="w-full">
              {TabComponent && (
                <TabComponent setReminderVideo={setReminderVideo} />
              )}
            </Tabs.Content>
          );
        })}
      </div>
    </Tabs.Root>
  );
};

const MobileTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
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
              {tabData.map((tab) => (
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
