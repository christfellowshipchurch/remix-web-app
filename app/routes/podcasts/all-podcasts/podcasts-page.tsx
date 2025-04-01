import { useLoaderData } from "react-router-dom";
import { DynamicHero } from "~/components";
import { PodcastHubCard } from "./components/podcast-card";
import type { PodcastsHubLoaderData } from "./loader";

export function PodcastsPage() {
  const { podcasts } = useLoaderData() as PodcastsHubLoaderData;

  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="/assets/images/podcasts/hero.jpg"
        customTitle="Podcasts"
        ctas={[{ href: "#latest", title: "Call to Action" }]}
      />
      <div className="py-10 md:py-20 w-full mx-auto">
        <div className="flex flex-col items-center">
          {podcasts.map((podcast, index) => (
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
