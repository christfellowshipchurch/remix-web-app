import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import { MoreEpisodesSearch } from "../components/more-episodes-search";

export function MoreEpisodes() {
  const { episode, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const { show, season } = episode;

  return (
    <div className="w-full bg-white content-padding">
      <div className="flex flex-col gap-8 md:gap-7 max-w-screen-content mx-auto py-16 md:py-20">
        <h2 className="text-[28px] font-extrabold">More in this season</h2>

        <MoreEpisodesSearch
          ALGOLIA_APP_ID={ALGOLIA_APP_ID}
          ALGOLIA_SEARCH_API_KEY={ALGOLIA_SEARCH_API_KEY}
          show={show}
          season={season}
          currentEpisodeTitle={episode.title}
        />
      </div>
    </div>
  );
}
