import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "./loader";
import { SubscribeSection } from "../podcasts-details/partials/subscribe-section.partial";
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
        description={episode.description}
        season={episode.season}
        episodeNumber={episode.episodeNumber}
        authors={episode.authors}
      />
      <EpisodeNotes content={episode.content} resources={episode.resources} />
      <SubscribeSection shareLinks={episode.shareLinks} />
      <MoreEpisodes show={episode.show} season={episode.season} />
    </div>
  );
}
