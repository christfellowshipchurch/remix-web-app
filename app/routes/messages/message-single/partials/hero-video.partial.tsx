import { VideoHeader } from "~/components";
import { MessageReturnType } from "../loader";
import { useLoaderData } from "react-router";
import kebabCase from "lodash/kebabCase";

const VideoSkeleton = () => (
  <div className="w-full aspect-video bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-[length:200%_100%] animate-gradient rounded-lg" />
);

export const MessageVideo: React.FC = () => {
  const { message } = useLoaderData<MessageReturnType>();
  const messageSeries = message.attributeValues.messageSeries.valueFormatted;

  return (
    <VideoHeader
      wistiaId={message.wistiaId || ""}
      video={message.video || ""}
      ctas={[
        messageSeries && {
          title: "Sermon Series Resources",
          href: `/series-resources/${kebabCase(messageSeries)}`,
        },
        { title: "Share", href: "#" },
      ].filter((cta): cta is { title: string; href: string } => Boolean(cta))}
      fallback={<VideoSkeleton />}
    />
  );
};
