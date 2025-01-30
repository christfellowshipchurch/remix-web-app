import { useLoaderData } from "react-router";
import { MessageReturnType } from "../loader";
import HTMLRenderer from "~/primitives/html-renderer";

export const MessageContent = ({}) => {
  const { message } = useLoaderData<MessageReturnType>();

  return (
    <div className="flex w-full flex-col gap-24 pt-10 pb-2 content-padding">
      {/* Content */}
      <div className="flex flex-col gap-6 max-w-screen-content w-full mx-auto">
        {/* Speaker/Date Section */}
        <div className="flex flex-col">
          <h2 className="heading-h3">{message.summary}</h2>
          <div className="flex gap-1 text-[#AAAAAA]">
            <p>{message.attributeValues.author.valueFormatted}</p>
            <span>-</span>
            <p>{message.startDateTime}</p>
          </div>
        </div>
        {/* TODO: Content - Update HTML Renderer */}
        <HTMLRenderer html={message.content} />
      </div>
      {/* TODO: Setup Resources -> Should not be inside of Content?? */}
    </div>
  );
};
