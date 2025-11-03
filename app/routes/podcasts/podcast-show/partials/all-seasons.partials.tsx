import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import { PodcastEpisodeList } from "../components/podcast-episode-list";

export const AllSeasons = () => {
  const { podcast, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  return (
    <div className="w-full bg-[#F5F5FA] content-padding">
      <div className="max-w-screen-content mx-auto py-16 md:py-28">
        <div className="flex flex-col gap-8">
          <h2 className="text-[28px] font-extrabold">All Seasons</h2>

          <PodcastEpisodeList
            ALGOLIA_APP_ID={ALGOLIA_APP_ID}
            ALGOLIA_SEARCH_API_KEY={ALGOLIA_SEARCH_API_KEY}
            podcastTitle={podcast.title}
          />
        </div>
      </div>
    </div>
  );
};
