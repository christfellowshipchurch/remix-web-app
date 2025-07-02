import { PodcastEpisode } from "../../types";

export function EpisodePlayer({ audio }: {  
  audio: PodcastEpisode["audio"] }) {
  // Update with embed audio playing system
  return (
    <div
      className="w-full h-[70px] md:h-[100px] bg-cover bg-center"
      style={{ backgroundImage: `url(/assets/images/podcasts/audio-bg.jpg)` }}
    />
  );
}
