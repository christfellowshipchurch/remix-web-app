import { useState } from "react";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import { PodcastEpisodeCard } from "../components/podcast-episode-card";

export const AllSeasons = () => {
  const { podcast } = useLoaderData<LoaderReturnType>();
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  return (
    <div className="w-full bg-[#F5F5FA] content-padding">
      <div className="max-w-screen-content mx-auto py-16 md:py-28">
        <div className="flex flex-col gap-8">
          <h2 className="text-[28px] font-extrabold">All Seasons</h2>

          {/* Seasons Navigation */}
          <div className="flex flex-wrap gap-3">
            {podcast.seasons.map((season, index) => (
              <button
                key={index}
                onClick={() => setSelectedSeasonIndex(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    index === selectedSeasonIndex
                      ? "bg-ocean text-white"
                      : "bg-white hover:bg-ocean hover:text-white"
                  }`}
              >
                {season.title}
              </button>
            ))}
          </div>

          {/* Episodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {podcast.seasons[selectedSeasonIndex].episodes.map(
              (episode, index) => (
                <PodcastEpisodeCard key={index} podcastEpisode={episode} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
