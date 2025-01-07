import Button from "~/primitives/button";
import { useLoaderData } from "react-router";
import { RelatedMessageCard } from "../components/related-message-card.component";
import { Message, MessageReturnType } from "../loader";
import SectionTitle from "~/components/section-title";

/**
 * todo : turn this into Related Messages, currently articles...
 */

export const RelatedMessages = () => {
  const { relatedMessages } = useLoaderData<MessageReturnType>();
  const tagId = relatedMessages?.tagId;
  const messages = relatedMessages?.messages;

  const viewMoreLink = `/related-messages/${tagId}`;

  return (
    <div className="bg-white w-full flex justify-center">
      <div className="flex w-full max-w-xxl flex-col items-center py-12 md:py-24 lg:max-w-xl xl:max-w-xxl ">
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
        <div className="my-4 flex w-full flex-col justify-center gap-6 md:my-8 lg:my-20 lg:flex-row">
          {messages?.map((message: Message, i: number) => (
            <RelatedMessageCard key={i} message={message} />
          ))}
        </div>
        <Button
          className="mt-4 block px-6 py-4 text-xl md:mt-0 md:px-8 md:py-6 lg:hidden"
          size="sm"
          intent="primary"
          href={viewMoreLink}
        >
          View More
        </Button>
      </div>
    </div>
  );
};
