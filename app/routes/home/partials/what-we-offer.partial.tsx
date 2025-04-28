import { SectionTitle } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import * as Tabs from "@radix-ui/react-tabs";
import { button, Button } from "~/primitives/button/button.primitive";
import { whatWeOfferData } from "./what-we-offer.data";

export function WhatWeOfferSection() {
  return (
    <section
      className="content-padding w-full pt-38 pb-23 bg-navy"
      style={{
        backgroundImage: `url('/assets/images/home/sfe-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-screen-content mx-auto flex flex-col gap-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <div className="w-full items-center justify-center flex gap-5">
              <SectionTitle sectionTitle="what we offer." />
              <div className="w-6 bg-ocean h-1" />
            </div>
            <h2 className="text-white text-center font-extrabold text-[32px] lg:text-[52px] leading-tight">
              Something For Everyone
            </h2>
          </div>
          {/* Tabs Section */}
          <div className="w-full">
            <Tabs.Root defaultValue="next-gen" className="w-full">
              <Tabs.List className="flex gap-4 justify-center">
                {whatWeOfferData.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className={`${button({
                      intent: "secondary",
                    })} data-[state=active]:border-ocean data-[state=active]:bg-ocean !rounded-full border-white text-white`}
                  >
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              {whatWeOfferData.map((tab) => (
                <Tabs.Content key={tab.value} value={tab.value}>
                  <p className="max-w-[600px] text-lg">{tab.description}</p>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </div>
        </div>

        {/* Button Section - Desktop */}
        <div className="hidden lg:block">
          <p className="text-white text-center max-w-[510px] mx-auto">
            Empowering your children and strengthening your family through
            engaging, faith-centered experiences.
          </p>
        </div>

        {/* Button Section - Mobile */}
        <div className="block lg:hidden">
          <IconButton
            iconName="arrowRight"
            className="mx-auto rounded-full border-white text-white"
            withRotatingArrow
          >
            View All Ministries
          </IconButton>
        </div>
      </div>
    </section>
  );
}
