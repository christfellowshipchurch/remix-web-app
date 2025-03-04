import { useLoaderData } from "react-router-dom";
import { DynamicHero } from "~/components/dynamic-hero";
import { PodcastCard } from "./components/podcast-card";
import type { PodcastsLoaderData } from "../types";
import SectionTitle from "~/components/section-title";

export function PodcastsPage() {
  const { podcasts } = useLoaderData() as PodcastsLoaderData;

  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="/assets/images/articles-hero-bg.jpg"
        customTitle="Podcasts"
        ctas={[{ href: "#latest", title: "Call to Action" }]}
      />

      <div className="content-padding">
        <div className="py-10 md:py-20 w-full max-w-screen-content mx-auto">
          <div className="mb-10 md:mb-20 flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-24">
            <SectionTitle sectionTitle="our podcasts." />
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary mb-4 leading-none">
              Conversations On Faith,
              <br />
              Community, And Culture
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
            {podcasts.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                className="md:last:col-span-2 md:last:max-w-[50%] md:last:mx-auto"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
