import { useRef, useEffect } from "react";
import { SectionTitle } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import * as Tabs from "@radix-ui/react-tabs";
import { Button, button } from "~/primitives/button/button.primitive";
import { whatWeOfferData, WhatWeOfferTab } from "./what-we-offer.data";
import { cn } from "~/lib/utils";

export function WhatWeOfferSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to center card on mobile (when overflow-x-auto is active)
  useEffect(() => {
    if (
      scrollContainerRef.current &&
      cardRefs.current.length > 0 &&
      window.innerWidth < 1024
    ) {
      const centerIndex = Math.floor(cardRefs.current.length / 2);
      const centerCard = cardRefs.current[centerIndex];
      if (centerCard && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardRect = centerCard.getBoundingClientRect();
        const scrollLeft =
          centerCard.offsetLeft -
          container.offsetWidth / 2 +
          cardRect.width / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, []);

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
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 lg:gap-4 content-padding">
            {/* Mobile Section Title */}
            <div className="w-full items-center md:hidden">
              <SectionTitle sectionTitle="what we offer." color="#56CAEB" />
            </div>

            {/* Desktop Section Title */}
            <div className="w-full items-center justify-center gap-5 hidden md:flex">
              <SectionTitle sectionTitle="what we offer." />
              <div className="w-6 bg-ocean h-1" />
            </div>

            <h2 className="text-white md:text-center font-extrabold text-[32px] lg:text-[52px] leading-tight">
              Something For Everyone
            </h2>
          </div>

          {/* Tabs Section */}
          <div className="w-full">
            <Tabs.Root
              defaultValue="family"
              className="w-full  flex flex-col gap-4 md:gap-8 lg:gap-12"
            >
              {/* Tabs */}
              <Tabs.List className="flex justify-between lg:gap-4 lg:justify-center rounded-[13px] bg-[rgba(244,245,247,0.37)] p-1 lg:p-0 lg:rounded-none lg:bg-transparent max-w-[360px] lg:max-w-none mx-auto">
                {whatWeOfferData.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className={`${button({
                      intent: "secondary",
                    })}  data-[state=active]:text-black lg:data-[state=active]:text-white data-[state=active]:bg-white lg:data-[state=active]:bg-ocean n rounded-full border-transparent lg:border-white lg:data-[state=active]:border-ocean text-white hover:border-ocean py-[11px] px-[14px] data-[state=active]:shadow-[0px_2.416px_2.416px_0px_rgba(0,0,0,0.25)] data-[state=active]:py-2 data-[state=active]:mb-[2px] lg:py-3 lg:px-6 lg:data-[state=active]:shadow-none lg:data-[state=active]:py-3 lg:data-[state=active]:mb-0`}
                  >
                    <p className="hidden lg:block">{tab.label}</p>
                    <p className="block lg:hidden">{tab.mobileLabel}</p>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {/* Mobile Tabs Divider */}
              <div className="w-full h-[1px] bg-[#D8D8DB]/25 md:hidden" />

              {/* Tabs Content */}
              {whatWeOfferData.map((tab) => (
                <Tabs.Content
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-4 w-full overflow-x-auto md:overflow-x-visible pb-2"
                >
                  {/* iPad Divider */}
                  <div className="w-full h-[1px] bg-[#D8D8DB]/25 hidden md:block lg:hidden" />
                  <div
                    className={cn(
                      "flex gap-8 md:gap-4 lg:gap-8 flex-nowrap overflow-x-auto md:overflow-x-visible px-2 md:mx-auto min-h-[400px] md:min-h-0 pt-2 md:pt-0",
                      tab.content.length === 2
                        ? "items-stretch"
                        : "items-center"
                    )}
                    ref={scrollContainerRef}
                  >
                    {tab.content.map((content, index) => (
                      <div
                        key={index}
                        ref={(element) => (cardRefs.current[index] = element)}
                        className={cn(
                          "min-w-[72vw] md:min-w-[230px] lg:min-w-[320px]",
                          tab.content.length === 2 && {
                            "-rotate-1": index === 0,
                            "rotate-1": index === 1,
                          },
                          tab.content.length === 3 && {
                            "-rotate-3": index === 0,
                            "rotate-3": index === 2,
                            "rotate-0": index === 1,
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
        </div>

        {/* Bottom Section - Desktop (text) */}
        <div className="hidden lg:block">
          <p className="text-white text-center max-w-[510px] mx-auto">
            Empowering your children and strengthening your family through
            engaging, faith-centered experiences.
          </p>
        </div>

        {/* Bottom Section - Mobile (buttons) */}
        <div className="block lg:hidden">
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
        "flex flex-col justify-between gap-12 rounded-[18px] bg-white p-9 w-[72vw] md:w-[230px] lg:w-[320px] h-full",
        middleCard && "min-h-[380px] md:min-h-[420px] lg:min-h-[450px]"
      )}
    >
      <div className="flex flex-col items-center gap-9 flex-1">
        {content.image ? (
          <div className="w-full flex justify-center">
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
          <p className="text-semibold text-lg text-center">
            {content.description1}
          </p>
          {content.description2 && (
            <p className="text-semibold text-lg text-center">
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
