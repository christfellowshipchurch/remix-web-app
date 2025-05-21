import { useEffect, useRef } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "~/lib/utils";
import { button } from "~/primitives/button/button.primitive";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import { SectionTitle } from "~/components";

import { whatWeOfferData } from "./what-we-offer.data";
import { WhatWeOfferCard } from "./desktop.component";

export const WhatWeOfferMobile = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || window.innerWidth >= 1024) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll("[data-card]");
    if (cards.length === 0) return;

    // Find the middle card
    const middleIndex = Math.floor(cards.length / 2);
    const middleCard = cards[middleIndex] as HTMLElement;
    if (!middleCard) return;

    // Calculate scroll position to center the middle card
    const containerWidth = container.clientWidth;
    const cardWidth = middleCard.offsetWidth;
    const cardOffset = middleCard.offsetLeft;
    const scrollPosition = cardOffset - (containerWidth - cardWidth) / 2;

    // Scroll to center
    container.scrollTo({
      left: scrollPosition,
      behavior: "auto",
    });
  }, []);

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
        <Tabs.Root defaultValue="family" className="w-full flex flex-col gap-4">
          <Tabs.List className="flex justify-between rounded-[13px] bg-[rgba(244,245,247,0.37)] p-1 max-w-[360px] mx-auto">
            {whatWeOfferData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  button({ intent: "secondary" }),
                  "rounded-full border-transparent text-white hover:border-ocean py-[11px] px-[14px]",
                  "data-[state=active]:text-black data-[state=active]:bg-white",
                  "data-[state=active]:shadow-[0px_2.416px_2.416px_0px_rgba(0,0,0,0.25)]",
                  "data-[state=active]:py-2 data-[state=active]:mb-[2px]"
                )}
              >
                <p>{tab.mobileLabel}</p>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <div className="w-full h-[1px] bg-[#D8D8DB]/25" />

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
                  "flex gap-8 flex-nowrap overflow-x-auto px-2 min-h-[400px] pt-2",
                  tab.content.length === 2 ? "items-stretch" : "items-center"
                )}
              >
                {tab.content.map((content, index) => (
                  <div key={index} data-card className="min-w-[72vw]">
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
