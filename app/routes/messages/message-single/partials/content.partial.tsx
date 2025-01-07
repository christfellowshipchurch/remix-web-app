import { useLoaderData } from "react-router";
import { MessageReturnType } from "../loader";
import HTMLRenderer from "~/primitives/html-renderer";

export const MessageContent = ({}) => {
  const { message } = useLoaderData<MessageReturnType>();

  return (
    <div className="flex w-full max-w-3xl flex-col gap-24 pt-10 pb-2 lg:max-w-xl xl:max-w-xxl">
      {/* Content */}
      <div className="flex flex-col gap-6">
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
