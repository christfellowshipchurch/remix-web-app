import { VideoHeader } from "~/components";
import { MessageReturnType } from "../loader";
import { useLoaderData } from "react-router";

const VideoSkeleton = () => (
  <div className="w-full aspect-video bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-[length:200%_100%] animate-gradient rounded-lg" />
);

export const MessageVideo: React.FC = () => {
  const { message } = useLoaderData<MessageReturnType>();
  return (
    <VideoHeader
      wistiaId={message.wistiaId || ""}
      video={message.video || ""}
      ctas={[
        {
          title: "Sermon Series Resources",
          href: `/resources/todo-resources`,
        },
        { title: "Share", href: "#" },
      ]}
      fallback={<VideoSkeleton />}
    />
  );
};
