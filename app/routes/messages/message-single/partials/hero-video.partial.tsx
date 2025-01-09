import { DynamicVideoHeader } from "~/components/dynamic-video-header";
import { MessageReturnType } from "../loader";
import { useLoaderData } from "react-router";

export const MessageVideo: React.FC = ({}) => {
  const { message } = useLoaderData<MessageReturnType>();
  // TODO: Fix link to Sermon Resources
  return (
    <DynamicVideoHeader
      wistiaId={message.wistiaId || ""}
      video={message.video || ""}
      ctas={[
        {
          title: "Sermon Series Resources",
          href: `/resources/todo-resources`,
        },
        { title: "Share", href: "#" },
      ]}
    />
  );
};
