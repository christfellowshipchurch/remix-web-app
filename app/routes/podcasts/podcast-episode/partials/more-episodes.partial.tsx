import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import { MoreEpisodesSearch } from "../components/more-episodes-search";

export function MoreEpisodes() {
  const { episode, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();

  const { show, season } = episode;

  return (
    <MoreEpisodesSearch
      ALGOLIA_APP_ID={ALGOLIA_APP_ID}
      ALGOLIA_SEARCH_API_KEY={ALGOLIA_SEARCH_API_KEY}
      podcastShow={show}
      podcastSeason={season}
      currentEpisodeTitle={episode.title}
    />
  );
}
