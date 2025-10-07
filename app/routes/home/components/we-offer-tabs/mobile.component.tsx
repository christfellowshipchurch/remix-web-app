import { useEffect, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "~/lib/utils";
import { button } from "~/primitives/button/button.primitive";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import { SectionTitle } from "~/components";

import { whatWeOfferData } from "./what-we-offer.data";
import { WhatWeOfferCard } from "./desktop.component";

export const WhatWeOfferMobile = ({
  onTabChange,
}: {
  onTabChange?: (tabValue: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("family");

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    onTabChange?.(tabValue);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll("[data-card]");
    if (cards.length === 0) return;

    // For 2 cards, center the first card; for 3 cards, center the middle card
    const targetIndex = cards.length === 2 ? 0 : Math.floor(cards.length / 2);
    const targetCard = cards[targetIndex] as HTMLElement;
    if (!targetCard) return;

    // Calculate scroll position to center the target card
    const containerWidth = container.clientWidth;
    const cardWidth = targetCard.offsetWidth;
    const cardOffset = targetCard.offsetLeft;
    const scrollPosition = cardOffset - (containerWidth - cardWidth) / 2;

    // Scroll to center
    container.scrollTo({
      left: scrollPosition,
      behavior: "auto",
    });
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 content-padding">
        <div className="w-full items-center">
          <SectionTitle sectionTitle="what we offer." color="#56CAEB" />
        </div>
        <h2 className="text-white font-extrabold text-[32px] leading-tight">
          Something For Everyones
        </h2>
      </div>

      <div className="w-full">
        <Tabs.Root
          defaultValue="family"
          className="w-full flex flex-col gap-4"
          onValueChange={handleTabChange}
        >
          <Tabs.List className="flex justify-between gap-1 rounded-[13px] bg-[rgba(244,245,247,0.37)] p-2 max-w-[360px] mx-auto">
            {whatWeOfferData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  button({ intent: "secondary" }),
                  "rounded-xl border-transparent text-white hover:border-ocean py-1 px-3",
                  "data-[state=active]:text-black data-[state=active]:bg-white",
                  "data-[state=active]:shadow-[0px_2.416px_2.416px_0px_rgba(0,0,0,0.25)]",
                  "data-[state=active]:py-2 data-[state=active]:mb-[2px]"
                )}
                data-tab={tab.value}
              >
                <p>{tab.mobileLabel}</p>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* divider */}
          <div className="w-full h-[1px] bg-[#D8D8DB]/25 max-w-[350px] mx-auto" />

          {whatWeOfferData.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex flex-col gap-4 w-full overflow-x-auto pb-2 max-w-[100vw] mx-auto",
                "data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300"
              )}
            >
              <div
                ref={containerRef}
                className={cn(
                  "flex gap-8 flex-nowrap overflow-x-auto min-h-[400px] pt-2",
                  "snap-x snap-mandatory scroll-smooth",
                  tab.content.length === 2 ? "items-stretch" : "items-center"
                )}
                style={{
                  paddingLeft: "calc(50vw - 36vw)",
                  paddingRight: "calc(50vw - 36vw)",
                }}
              >
                {tab.content.map((content, index) => (
                  <div
                    key={index}
                    data-card
                    className="snap-center snap-always"
                    data-card-title={content.label}
                    data-tab-context={tab.value}
                  >
                    <WhatWeOfferCard
                      content={content}
                      middleCard={index === 1 && tab.content.length === 3}
                    />
                  </div>
                ))}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>

      <div>
        <IconButton
          to="/ministries"
          iconName="arrowBack"
          className="rounded-full border-white text-white"
          style={{
            margin: "0 auto",
            width: "fit-content",
          }}
          withRotatingArrow
        >
          View All Ministries
        </IconButton>
      </div>
    </div>
  );
};
