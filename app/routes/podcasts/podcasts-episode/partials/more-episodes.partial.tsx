import { PodcastEpisode } from "../../podcasts-details/loader";
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
      shareLinks: [],
      show,
      title: "Episode 1",
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
      shareLinks: [],
      show,
      title: "Episode 2",
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
      shareLinks: [],
      show,
      title: "Episode 3",
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
      shareLinks: [],
      show,
      title: "Episode 3",
    },
  ];

  return (
    <div className="w-full bg-white content-padding">
      <div className="flex flex-col gap-6 lg:gap-16 max-w-screen-content mx-auto py-16 md:py-20">
        <h2 className="text-[28px] font-extrabold">More in this season</h2>
        <div className="flex overflow-x-auto md:overflow-x-hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockMoreEpisodes.map((episode, index) => (
            <PodcastEpisodeCard key={index} podcastEpisode={episode} />
          ))}
        </div>
      </div>
    </div>
  );
}
