import { useLoaderData } from "react-router";
import { LoaderReturnType } from "./loader";
import { PodcastsHero } from "./partials/podcasts-hero.partial";
import { LatestEpisodes } from "./partials/latests-episodes.partials";
import { AllSeasons } from "./partials/all-seasons.partials";
import { SubscribeSection } from "./partials/subscribe-section.partial";
import { DynamicInfo } from "./components/dynamic-info.component";

export function PodcastsDetailsPage() {
  const { podcast } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col items-center">
      <PodcastsHero podcast={podcast} />
      <LatestEpisodes />
      <SubscribeSection shareLinks={podcast.shareLinks} />
      <DynamicInfo />
      <AllSeasons />
    </div>
  );
}
