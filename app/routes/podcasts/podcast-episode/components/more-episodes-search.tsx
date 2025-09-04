import { useMemo } from "react";
import { InstantSearch, Hits, Configure } from "react-instantsearch";
import { Icon } from "~/primitives/icon/icon";
import { Link } from "react-router-dom";
import lodash from "lodash";
import { ContentItemHit } from "~/routes/search/types";
import { createSearchClient } from "~/lib/create-search-client";

interface MoreEpisodesSearchProps {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  show: string;
  season: string;
  currentEpisodeTitle?: string;
}

const { kebabCase } = lodash;

const MoreEpisodesHitComponent = ({ hit }: { hit: ContentItemHit }) => {
  return (
    <div className="flex flex-col pb-4 md:pb-0 gap-4 w-full min-w-3/4 md:min-w-0 md:w-[340px] lg:w-full">
      <div className="relative md:w-[340px] lg:w-full">
        <img
          src={
            hit.coverImage?.sources?.[0]?.uri ||
            "/assets/images/podcasts/hero.jpg"
          }
          alt={hit.title}
          className="w-full relative aspect-square md:w-[340px] lg:w-full object-cover rounded-[0.5rem]"
        />
        <Link
          to={`/podcasts/${kebabCase(hit.title)}/${hit.title}`}
          className="absolute bottom-4 left-4 bg-white p-1 rounded-full hover:bg-gray-300 transition-colors duration-300"
          style={{
            boxShadow:
              "0px 4px 8px -2px rgba(0, 0, 0, 0.20), 0px 2px 4px -2px rgba(0, 0, 0, 0.09)",
          }}
        >
          <Icon name="play" color="black" size={32} className="pl-1" />
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-secondary">
          Season {hit.seasonNumber} | Episode {hit.episodeNumber}
        </p>
        <h3 className="text-lg font-bold">{hit.title}</h3>
      </div>
    </div>
  );
};

export const MoreEpisodesSearch = ({
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY,
  show,
  season,
  currentEpisodeTitle,
}: MoreEpisodesSearchProps) => {
  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  // Filter for episodes from the same show and season, excluding the current episode
  const filter = `contentType:"Podcast" AND show:"${show}" AND seasonNumber:${season}${
    currentEpisodeTitle ? ` AND NOT title:"${currentEpisodeTitle}"` : ""
  }`;

  return (
    <InstantSearch
      indexName="dev_daniel_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure filters={filter} hitsPerPage={8} />

      {/* Episodes Grid */}
      <Hits
        hitComponent={MoreEpisodesHitComponent}
        classNames={{
          list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        }}
      />
    </InstantSearch>
  );
};
