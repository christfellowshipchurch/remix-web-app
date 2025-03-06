import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/primitives/shadcn-primitives/carousel";
import { PodcastEpisodeCard } from "../components/podcast-episode-card";

export const LatestEpisodes = () => {
  const { latestEpisodes } = useLoaderData<LoaderReturnType>();

  return (
    <div className="w-full bg-white content-padding">
      <div className="max-w-screen-content mx-auto py-28">
        <div className="flex flex-col gap-4">
          <h2 className="text-[28px] font-extrabold">Latest Episodes</h2>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full mt-8 relative mb-12"
          >
            <CarouselContent className="flex pb-4 lg:pb-0 lg:max-w-full gap-6">
              {latestEpisodes.map((episode, index) => (
                <CarouselItem
                  key={index}
                  className="w-full aspect-video basis-[75%] sm:basis-[50%] lg:basis-[31.5%] pl-0"
                >
                  <PodcastEpisodeCard podcastEpisode={episode} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -bottom-7">
              <CarouselPrevious
                className="left-0 border-navy disabled:border-[#AAAAAA]"
                fill="#004f71"
                disabledFill="#AAAAAA"
              />
              <CarouselNext
                className="left-12 border-navy disabled:border-[#AAAAAA]"
                fill="#004f71"
                disabledFill="#AAAAAA"
              />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
