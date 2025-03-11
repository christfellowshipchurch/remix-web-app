import { PodcastEpisode } from "../../types";
import { HeroContent } from "../components/hero-content.component";
import { HeroFooter } from "../components/hero-footer.component";

export function EpisodeHero({ episode }: { episode: PodcastEpisode }) {
  const { authors, coverImage, description, episodeNumber, season, title } =
    episode;

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b bg-[#313038] from-navy/30 to-ocean/30 backdrop-blur-lg ">
        <div className="flex p-6 md:pb-12 md:px-12 md:pt-24">
          <div className="flex flex-col-reverse md:flex-row items-center mx-auto justify-center w-full max-w-[1438px] gap-16">
            <img
              className="rounded-[1rem] object-cover aspect-square w-full max-w-[80vw] md:size-[300px] lg:size-[420px] xl:size-[460px]"
              src={coverImage}
              alt={title || "Cover"}
            />
            <HeroContent
              authors={authors}
              description={description}
              episodeNumber={episodeNumber}
              season={season}
              title={title}
            />
          </div>
        </div>
        <HeroFooter />
      </div>
    </div>
  );
}
