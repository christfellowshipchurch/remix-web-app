import { Icon } from "~/primitives/icon/icon";
import { PodcastEpisode } from "../../types";
import { Link } from "react-router-dom";

export const PodcastEpisodeCard = ({
  podcastEpisode,
  podcastShow,
}: {
  podcastEpisode: PodcastEpisode;
  podcastShow: string;
}) => {
  const { title, season, episodeNumber, coverImage, url } = podcastEpisode;

  const cardUrl = `/podcasts/${podcastShow}/${url}`;

  return (
    <div className="flex flex-col pb-4 md:pb-0 gap-4 w-full min-w-3/4 md:min-w-0 md:w-[340px] lg:w-full">
      <div className="relative md:w-[340px] lg:w-full">
        <img
          src={coverImage}
          alt={title}
          className="w-full relative aspect-square md:w-[340px] lg:w-full object-cover rounded-[0.5rem]"
        />
        <Link
          to={cardUrl}
          className="absolute bottom-4 left-4 bg-white p-1 rounded-full hover:bg-gray-300 transition-colors duration-300"
          style={{
            boxShadow:
              "0px 4px 8px -2px rgba(0, 0, 0, 0.20), 0px 2px 4px -2px rgba(0, 0, 0, 0.09)",
          }}
        >
          <Icon name="play" color="black" size={32} className="pl-1" />
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-secondary">{`Season ${season} | Episode ${episodeNumber}`}</p>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </div>
  );
};
