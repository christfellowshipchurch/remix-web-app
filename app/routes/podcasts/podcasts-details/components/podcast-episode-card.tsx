import { PodcastEpisode } from "../loader";

export const PodcastEpisodeCard = ({
  podcastEpisode,
}: {
  podcastEpisode: PodcastEpisode;
}) => {
  const { title, season, episodeNumber, coverImage } = podcastEpisode;

  return (
    <div className="flex flex-col gap-4 w-full md:max-w-[340px]">
      <img
        src={coverImage}
        alt={title}
        className="w-full relative aspect-square md:size-[340px] object-cover rounded-[0.5rem]"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">{`Season ${season} | Episode ${episodeNumber}`}</p>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </div>
  );
};
