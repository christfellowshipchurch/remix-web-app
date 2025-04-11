import { Button } from "~/primitives/button/button.primitive";
import { useLoaderData } from "react-router";
import { SectionTitle } from "~/components";

import { MessageReturnType } from "../loader";
import { MessagesCarousel } from "../components/messages-carousel.component";

export const RelatedMessages = () => {
  const { relatedMessages } = useLoaderData<MessageReturnType>();
  const tagId = relatedMessages?.tagId;
  const messages = relatedMessages?.messages;

  const viewMoreLink = `/related-messages/${tagId}`;

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
              href={viewMoreLink}
              size="md"
              className="hidden lg:block"
              intent="primary"
            >
              View All
            </Button>
          </div>
        </div>
        <MessagesCarousel messages={messages} />
      </div>
    </div>
  );
};
