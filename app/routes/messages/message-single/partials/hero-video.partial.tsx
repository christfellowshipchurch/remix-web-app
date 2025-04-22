import { VideoHeader } from "~/components";
import { MessageReturnType } from "../loader";
import { useLoaderData } from "react-router";
import kebabCase from "lodash/kebabCase";

const VideoSkeleton = () => (
  <div className="w-full aspect-video bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-[length:200%_100%] animate-gradient rounded-lg" />
);

export const MessageVideo: React.FC = () => {
  const { message } = useLoaderData<MessageReturnType>();

  const sermonResources = message.summary.includes("|")
    ? message.summary.split("|")[0]
    : null;

  return (
    <VideoHeader
      wistiaId={message.wistiaId || ""}
      video={message.video || ""}
      ctas={[
        sermonResources && {
          title: "Sermon Series Resources",
          href: `/series-resources/${kebabCase(sermonResources)}`,
        },
        { title: "Share", href: "#" },
      ].filter((cta): cta is { title: string; href: string } => Boolean(cta))}
      fallback={<VideoSkeleton />}
    />
  );
};
