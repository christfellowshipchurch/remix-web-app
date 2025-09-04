import { VideoHeader } from "~/components";
import { LoaderReturnType } from "../loader";
import { useLoaderData } from "react-router-dom";

const VideoSkeleton = () => (
  <div className="w-full aspect-video bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-[length:200%_100%] animate-gradient rounded-lg" />
);

export const MessageVideo: React.FC = () => {
  const { message } = useLoaderData<LoaderReturnType>();

  return (
    <VideoHeader
      wistiaId={message.video || ""}
      video={message.video || ""}
      videoClassName="aspect-7/4"
      controls={false}
      ctas={[
        message.seriesId && {
          title: "Sermon Series Resources",
          href: `/series-resources/${message.seriesId}`,
        },
        { title: "Share", href: "#" },
      ].filter((cta): cta is { title: string; href: string } => Boolean(cta))}
      fallback={<VideoSkeleton />}
    />
  );
};
