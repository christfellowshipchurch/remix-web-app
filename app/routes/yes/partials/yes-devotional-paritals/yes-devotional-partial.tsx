import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { twentyOneDaysDevotionalData } from "./devotional-data";
import HTMLRenderer from "~/primitives/html-renderer";
import { cn } from "~/lib/utils";

export const YesDevotionalPartial = () => {
  return (
    <div className="flex flex-col w-full h-full bg-gray pt-12 lg:pt-16">
      {/* Title Section */}
      <TitleSection />
      {/* Tabs Section */}
      <TabsSection />
    </div>
  );
};

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState(
    twentyOneDaysDevotionalData[0].value
  );

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-col justify-center items-center relative mt-16"
    >
      {/* Tabs List */}
      <Tabs.List className="flex w-full gap-4 max-w-[978px] items-center md:justify-center md:flex-wrap overflow-x-auto md:overflow-x-hidden pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {twentyOneDaysDevotionalData.map((tab, index) => (
          <Tabs.Trigger
            key={index}
            value={tab.value}
            className={cn(
              "flex px-4 py-1 font-semibold bg-white data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[29px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer min-w-[90px] md:min-w-auto items-center justify-center text-center",
              index === 0 && "md:ml-0 ml-4",
              index === twentyOneDaysDevotionalData.length - 1 && "md:mr-0 mr-4"
            )}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <div className="w-full content-padding bg-white pt-12 lg:pt-16 pb-32 lg:pb-56">
        <div className="w-full flex flex-col justify-center items-center max-w-[978px] mx-auto">
          {/* Tab */}
          {twentyOneDaysDevotionalData.map((tab, index) => (
            <Tabs.Content
              key={index}
              value={tab.value}
              className="w-full data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300"
            >
              <HTMLRenderer html={tab.content} className="devotional-content" />
            </Tabs.Content>
          ))}
        </div>
      </div>
    </Tabs.Root>
  );
};

const TitleSection = () => {
  return (
    <div className="w-full max-w-[978px] mx-auto px-4 lg:px-0">
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-[52px] font-extrabold">A 21-Day Devotional</h1>
        <p className="font-medium text-lg text-text-secondary">
          Inside this devotional, you’ll discover more about what it means to
          follow Jesus. Each day will include Scriptures to meditate on and
          ideas to consider as you begin your walk with God. Together, we’ll
          unpack what it looks like to be in a relationship with Jesus and how
          that relationship changes our lives from the inside out.
          <br />
          <br />
          This devotional spans 21 days, but you can go at your own pace. It’s a
          tool to guide your journey and spark conversations about your
          learning. Remember, following Jesus is a journey you don’t have to
          take alone. We’re excited to share this with you! If you’d like, you
          can{" "}
          <a
            href="/assets/pdf/yes-devotional.pdf"
            download
            className="text-ocean underline cursor-pointer"
          >
            download it as a PDF.
          </a>
        </p>
      </div>
    </div>
  );
};
