import { useLoaderData } from "react-router-dom";
import { DynamicHero } from "~/components";
import { PodcastHubCard } from "./components/podcast-card";
import { loader } from "./loader";
import { PodcastShow } from "../types";

export function AllPodcastsPage() {
  const { podcastShows } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="/assets/images/podcasts/hero.jpg"
        customTitle="Podcasts"
      />
      <div className="py-10 md:py-20 w-full">
        <div className="flex flex-col">
          {podcastShows.map((podcast: PodcastShow, index: number) => (
            <PodcastHubCard
              key={index}
              podcast={podcast}
              className={`${index % 2 !== 0 ? "bg-gray" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
