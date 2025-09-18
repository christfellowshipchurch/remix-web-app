import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "./loader";
import { SubscribeSection } from "../podcast-show/partials/subscribe-section.partial";
import { EpisodeNotes } from "./partials/episode-notes.partial";
import { EpisodePlayer } from "./partials/episode-player.partial";
import { MoreEpisodes } from "./partials/more-episodes.partial";
import { EpisodeHero } from "./partials/episode-hero.partial";
import { HeroMobileContent } from "./components/hero-mobile-content.component";

export function PodcastEpisode() {
  const { episode } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col items-center">
      <EpisodeHero episode={episode} />
      <EpisodePlayer audio={episode.audio} />
      <HeroMobileContent
        title={episode.title}
        summary={episode.summary}
        season={episode.season}
        episodeNumber={episode.episodeNumber}
        authors={episode.authors}
      />
      <EpisodeNotes content={episode.content} resources={episode.resources} />
      <SubscribeSection
        apple={episode.apple}
        spotify={episode.spotify}
        amazon={episode.amazon}
      />
      <MoreEpisodes show={episode.show} season={episode.season} />
    </div>
  );
}
