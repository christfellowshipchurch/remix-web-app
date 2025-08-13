import { PodcastEpisode } from "../../types";
import { HeroContent } from "../components/hero-content.component";
import { Breadcrumbs } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export function EpisodeHero({ episode }: { episode: PodcastEpisode }) {
  const { authors, coverImage, description, episodeNumber, season, title } =
    episode;

  return (
    <div className="w-full bg-gradient-to-b bg-[#313038] from-navy/30 to-ocean/30 backdrop-blur-lg content-padding">
      <div className="max-w-[1150px] mx-auto">
        <div className="flex py-6 md:py-16 lg:pt-24">
          <div className="flex flex-col-reverse md:flex-row items-center md:items-start lg:items-center justify-center w-full gap-6 lg:gap-16">
            <img
              className="rounded-[1rem] object-cover aspect-square w-full sm:max-w-[75vw] md:size-[300px] lg:size-[420px] xl:size-[460px]"
              src={coverImage}
              alt={title || "Cover"}
            />
            <div>
              <HeroContent
                authors={authors}
                description={description}
                episodeNumber={episodeNumber}
                season={season}
                title={title}
              />
              <div className="hidden md:block lg:hidden mt-6">
                <IconButton
                  className="text-white border-white"
                  withRotatingArrow
                >
                  Share this episode
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="h-[2px] w-full bg-[#D9D9D9] opacity-50" />
          <div className="flex flex-col md:flex-row justify-between items-center py-10">
            <Breadcrumbs mode="light" />
            <div className="mt-5 md:mt-0 flex-wrap justify-between hidden lg:flex">
              {/* TODO: Add share functionality */}
              <IconButton className="text-white border-white" withRotatingArrow>
                Share this episode
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
