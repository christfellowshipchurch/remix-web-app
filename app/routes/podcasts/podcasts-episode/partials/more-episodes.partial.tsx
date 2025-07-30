import { PodcastEpisode } from "../../types";
import { PodcastEpisodeCard } from "../../podcasts-details/components/podcast-episode-card";

export function MoreEpisodes({
  show,
  season,
}: {
  show: string;
  season: string;
}) {
  // Use show + season to find the other episodes of this season (Algolia), or query them in the loader and have them added.
  const mockMoreEpisodes: PodcastEpisode[] = [
    {
      audio: "/assets/audio/podcasts/episode-1.mp3",
      authors: "Pastor Julie Mullins",
      content: "Content 1",
      coverImage: "/assets/images/podcasts/hero.jpg",
      description: "Description 1",
      episodeNumber: "1",
      resources: [],
      season,
      show,
      title: "Episode 1",
      url: "episode-1",
      apple: "",
      spotify: "",
      amazon: "",
    },
    {
      audio: "/assets/audio/podcasts/episode-2.mp3",
      authors: "Pastor Julie Mullins",
      content: "Content 2",
      coverImage: "/assets/images/podcasts/hero.jpg",
      description: "Description 2",
      episodeNumber: "2",
      resources: [],
      season,
      show,
      title: "Episode 2",
      url: "episode-2",
      apple: "",
      spotify: "",
      amazon: "",
    },
    {
      audio: "/assets/audio/podcasts/episode-3.mp3",
      authors: "Pastor Julie Mullins",
      content: "Content 3",
      coverImage: "/assets/images/podcasts/hero.jpg",
      description: "Description 3",
      episodeNumber: "3",
      resources: [],
      season,
      show,
      title: "Episode 3",
      url: "episode-3",
      apple: "",
      spotify: "",
      amazon: "",
    },
    {
      audio: "/assets/audio/podcasts/episode-4.mp3",
      authors: "Pastor Julie Mullins",
      content: "Content 4",
      coverImage: "/assets/images/podcasts/hero.jpg",
      description: "Description 4",
      episodeNumber: "4",
      resources: [],
      season,
      show,
      title: "Episode 4",
      url: "episode-4",
      apple: "",
      spotify: "",
      amazon: "",
    },
  ];

  return (
    <div className="w-full bg-white content-padding">
      <div className="flex flex-col gap-8 md:gap-7 max-w-screen-content mx-auto py-16 md:py-20">
        <h2 className="text-[28px] font-extrabold">More in this season</h2>
        <div className="flex overflow-x-auto md:overflow-x-hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockMoreEpisodes.map((episode, index) => (
            <PodcastEpisodeCard
              key={index}
              podcastEpisode={episode}
              show={show}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
