import { SectionTitle } from "~/components";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "~/lib/utils";
import { Button, button } from "~/primitives/button/button.primitive";
import { whatWeOfferData, WhatWeOfferTab } from "./what-we-offer.data";

export const WhatWeOfferCard = ({
  content,
  middleCard,
}: {
  content: WhatWeOfferTab["content"][number];
  middleCard: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-12 rounded-[18px] bg-white p-6 lg:px-5 lg:py-8 w-[72vw] md:w-[230px] lg:w-[300px] xl:w-[340px] h-full",
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
          <p className="text-semibold lg:text-[17px] text-center">
            {content.description1}
          </p>
          {content.description2 && (
            <p className="text-semibold lg:text-[17px] text-center">
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

export const WhatWeOfferDesktop = () => {
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
                className={cn(
                  button({ intent: "secondary" }),
                  "rounded-full border-transparent text-white hover:border-ocean py-3 px-6",
                  "data-[state=active]:text-white data-[state=active]:bg-ocean border-white data-[state=active]:border-ocean"
                )}
                data-tab={tab.value}
              >
                <p>{tab.label}</p>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {whatWeOfferData.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex flex-col gap-4 w-full",
                "overflow-x-visible pb-2",
                "data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300"
              )}
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
                      "min-w-[230px] lg:min-w-[300px] xl:min-w-[340px]",
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
                      data-card-title={content.label}
                      data-tab-context={tab.value}
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
