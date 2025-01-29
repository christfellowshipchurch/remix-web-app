import Button from "~/primitives/button";
import { useLoaderData } from "react-router";
import { MessageReturnType } from "../loader";
import SectionTitle from "~/components/section-title";
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
          <div>
            <SectionTitle sectionTitle="related series." />
            <h2 className="text-text font-extrabold lg:text-[46px] xl:text-[52px] leading-none">
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
