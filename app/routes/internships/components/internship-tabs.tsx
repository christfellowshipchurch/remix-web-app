import * as Tabs from "@radix-ui/react-tabs";
import { ReactNode, useState } from "react";
import { cn } from "~/lib/utils";

interface TabItem {
  value: string;
  label: string;
  subtitle: string;
  content: ReactNode;
}

interface InternshipTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
}

const InternshipTabs = ({ tabs, defaultValue }: InternshipTabsProps) => {
  const [activeTab, setActiveTab] = useState(
    defaultValue || tabs[0]?.value || "",
  );

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[35%_65%] md:gap-[28px] lg:gap-25">
        {/* Left Side - Tab Buttons */}

        <Tabs.List className="flex md:flex-col">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <div
                key={tab.value}
                className={cn(
                  "relative py-5 px-3 md:px-[30px] flex-1",
                  "transition-colors duration-300",
                  isActive
                    ? "bg-navy text-white"
                    : "bg-transparent text-text-primary",
                  "rounded-lg",
                )}
              >
                {/* Horizontal Line */}
                <div
                  className={cn(
                    "h-px transition-colors duration-300",
                    isActive ? "bg-white" : "bg-navy",
                  )}
                />
                <Tabs.Trigger
                  value={tab.value}
                  className={cn(
                    "w-full pt-2 md:pt-4 text-left transition-all duration-300 flex flex-col gap-4",
                    "border-0",
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <p
                      className={cn(
                        "font-semibold text-lg",
                        isActive ? "text-white" : "text-text-primary",
                      )}
                    >
                      {tab.label}
                    </p>
                    {tab.subtitle && (
                      <p
                        className={cn(
                          "text-xs font-medium",
                          isActive ? "text-white" : "text-text-secondary",
                        )}
                      >
                        {tab.subtitle}
                      </p>
                    )}
                  </div>
                </Tabs.Trigger>
              </div>
            );
          })}
        </Tabs.List>

        {/* Right Side - Tab Content */}
        <div className="flex flex-col md:border-l border-navy">
          {tabs.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className={cn(
                "w-full",
                "data-[state=active]:animate-in data-[state=active]:fade-in",
                "data-[state=active]:zoom-in-95 data-[state=active]:duration-300",
              )}
            >
              {tab.content}
            </Tabs.Content>
          ))}
        </div>
      </div>
    </Tabs.Root>
  );
};

export default InternshipTabs;
