import { Icon } from "~/primitives/icon/icon";
import { PodcastEpisode } from "../loader";
import { Link } from "react-router";
import lodash from "lodash";

export const PodcastEpisodeCard = ({
  podcastEpisode,
}: {
  podcastEpisode: PodcastEpisode;
}) => {
  const { kebabCase } = lodash;
  const { title, show, season, episodeNumber, coverImage } = podcastEpisode;

  return (
    <div className="flex flex-col pb-4 md:pb-0 gap-4 w-full min-w-[80vw] md:min-w-0 md:max-w-[340px]">
      <div className="relative aspect-square md:size-[340px]">
        <img
          src={coverImage}
          alt={title}
          className="w-full relative aspect-square md:size-[340px] object-cover rounded-[0.5rem]"
        />
        <Link
          to={`/podcasts/${kebabCase(show)}/${title}`}
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
        <p className="text-sm text-[#666666]">{`Season ${season} | Episode ${episodeNumber}`}</p>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </div>
  );
};
