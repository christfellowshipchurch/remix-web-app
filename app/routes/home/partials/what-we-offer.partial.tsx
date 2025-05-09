import { useRef, useEffect } from "react";
import { SectionTitle } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import * as Tabs from "@radix-ui/react-tabs";
import { Button, button } from "~/primitives/button/button.primitive";
import {
  whatWeOfferData,
  WhatWeOfferTab,
} from "../components/what-we-offer.data";
import { cn } from "~/lib/utils";

const WhatWeOfferMobile = () => {
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
          Something For Everyone
        </h2>
      </div>

      <div className="w-full">
        <Tabs.Root defaultValue="family" className="w-full flex flex-col gap-4">
          <Tabs.List className="flex justify-between rounded-[13px] bg-[rgba(244,245,247,0.37)] p-1 max-w-[360px] mx-auto">
            {whatWeOfferData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={`${button({
                  intent: "secondary",
                })} data-[state=active]:text-black data-[state=active]:bg-white rounded-full border-transparent text-white hover:border-ocean py-[11px] px-[14px] data-[state=active]:shadow-[0px_2.416px_2.416px_0px_rgba(0,0,0,0.25)] data-[state=active]:py-2 data-[state=active]:mb-[2px]`}
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
              className="flex flex-col gap-4 w-full overflow-x-auto pb-2"
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

const WhatWeOfferDesktop = () => {
  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <div className="flex flex-col gap-4 content-padding">
        <div className="w-full items-center justify-center gap-5 flex">
          <SectionTitle sectionTitle="what we offer." color="#56CAEB" />
          <div className="w-6 bg-[#56CAEB] h-1" />
        </div>
        <h2 className="text-white text-center font-extrabold text-[52px] leading-tight">
          Something For Everyone
        </h2>
      </div>

      <div className="w-full">
        <Tabs.Root
          defaultValue="family"
          className="w-full flex flex-col gap-12"
        >
          <Tabs.List className="flex justify-center gap-4 max-w-none mx-auto">
            {whatWeOfferData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={`${button({
                  intent: "secondary",
                })} data-[state=active]:text-white data-[state=active]:bg-ocean border-white data-[state=active]:border-ocean text-white hover:border-ocean py-3 px-6`}
              >
                <p>{tab.label}</p>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {whatWeOfferData.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className="flex flex-col gap-4 w-full overflow-x-visible pb-2"
            >
              <div
                className={cn(
                  "flex gap-4 lg:gap-8 flex-nowrap overflow-x-visible mx-auto md:min-h-[520px] lg:min-h-[600px]",
                  tab.content.length === 2 ? "items-center" : "items-center"
                )}
              >
                {tab.content.map((content, index) => (
                  <div
                    key={index}
                    className={cn(
                      "min-w-[230px] lg:min-w-[320px]",
                      tab.content.length === 2 && {
                        "lg:-rotate-1": index === 0,
                        "lg:rotate-1": index === 1,
                      },
                      tab.content.length === 3 && {
                        "lg:-rotate-3": index === 0,
                        "lg:rotate-3": index === 2,
                        "lg:rotate-0": index === 1,
                      }
                    )}
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
        <p className="text-white text-center max-w-[510px] mx-auto">
          Empowering your children and strengthening your family through
          engaging, faith-centered experiences.
        </p>
      </div>
    </div>
  );
};

export function WhatWeOfferSection() {
  return (
    <section
      className="md:px-12 lg:px-18 w-full py-24 md:pt-38 md:pb-23 bg-navy"
      style={{
        backgroundImage: `url('/assets/images/home/sfe-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-screen-content mx-auto flex flex-col gap-12">
        <div className="md:hidden">
          <WhatWeOfferMobile />
        </div>
        <div className="hidden md:block">
          <WhatWeOfferDesktop />
        </div>
      </div>
    </section>
  );
}

const WhatWeOfferCard = ({
  content,
  middleCard,
}: {
  content: WhatWeOfferTab["content"][number];
  middleCard: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-12 rounded-[18px] bg-white p-6 lg:p-9 w-[72vw] md:w-[230px] lg:w-[320px] h-full",
        middleCard && "min-h-[340px] md:min-h-[340px] lg:min-h-[420px]"
      )}
    >
      <div className="flex flex-col items-center gap-9 flex-1">
        {content.image ? (
          <div className="w-full flex justify-center items-center md:min-h-[160px] lg:min-h-[190px]">
            <img
              src={content.image}
              alt={content.description1}
              className={cn(
                "max-h-[190px] w-auto",
                content.imageAspectRatio
                  ? `aspect-[${content.imageAspectRatio}]`
                  : "aspect-[200/125]"
              )}
            />
          </div>
        ) : (
          <h3 className="text-center text-[32px] lg:text-[52px] font-extrabold text-navy leading-none">
            {content.label}
          </h3>
        )}

        <div className="flex flex-col gap-4 flex-1 justify-end">
          <p className="text-semibold lg:text-lg text-center">
            {content.description1}
          </p>
          {content.description2 && (
            <p className="text-semibold lg:text-lg text-center">
              {content.description2}
            </p>
          )}
        </div>
      </div>
      <Button intent="primary" className="w-full h-[fit-content]">
        Learn More
      </Button>
    </div>
  );
};
