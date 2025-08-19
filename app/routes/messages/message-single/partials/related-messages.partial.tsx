/**
 * We will plan to rework this component once we have a way to fetch the related messages.
 */

import { Button } from "~/primitives/button/button.primitive";
import { useLoaderData } from "react-router-dom";
import { SectionTitle } from "~/components";

import { LoaderReturnType } from "../loader";
import { MessagesCarousel } from "../components/messages-carousel.component";

export const RelatedMessages = () => {
  const { seriesMessages } = useLoaderData<LoaderReturnType>();

  return (
    <div className="bg-white w-full flex justify-center content-padding">
      <div className="flex w-full  flex-col items-center py-12 md:py-24 max-w-screen-content">
        {/* Header */}
        <div className="w-full flex justify-between">
          <div className="gap-6 md:gap-8">
            <SectionTitle sectionTitle="related series." />
            <h2 className="text-text font-extrabold text-[28px] lg:text-[32px] leading-tight">
              Message Series On This Topic
            </h2>
          </div>
          <div className="flex items-end justify-between text-lg font-semibold">
            <Button
              href={"#todo"}
              size="md"
              className="hidden lg:block"
              intent="primary"
            >
              View All
            </Button>
          </div>
        </div>
        <MessagesCarousel messages={seriesMessages} />
      </div>
    </div>
  );
};
