import { useMemo } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  Configure,
  RefinementList,
} from "react-instantsearch";
import { Icon } from "~/primitives/icon/icon";
import { Link } from "react-router-dom";
import lodash from "lodash";
import { ContentItemHit } from "~/routes/search/types";

interface PodcastEpisodeSearchProps {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  podcastTitle: string;
}

const { kebabCase } = lodash;

const PodcastEpisodeHitComponent = ({ hit }: { hit: ContentItemHit }) => {
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
          {hit.contentTags?.find((tag) => tag.includes("Season")) || "Season 1"}{" "}
          | Episode{" "}
          {hit.contentTags
            ?.find((tag) => tag.includes("Episode"))
            ?.split(" ")[1] || "1"}
        </p>
        <h3 className="text-lg font-bold">{hit.title}</h3>
      </div>
    </div>
  );
};

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

export const PodcastEpisodeSearch = ({
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY,
  podcastTitle,
}: PodcastEpisodeSearchProps) => {
  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  const testFilter = `contentType:"Podcast" AND show:"${podcastTitle}"`;

  return (
    <InstantSearch
      indexName="dev_daniel_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      initialUiState={
        {
          refinementList: {
            season: ["Season 1"],
          },
        } as any
      }
    >
      <Configure filters={testFilter} hitsPerPage={12} />

      {/* Season Filter */}
      <div className="mt-6 mb-8">
        <RefinementList
          attribute="season"
          classNames={{
            list: "flex gap-6 flex-nowrap px-1 pb-4 overflow-x-auto",
            item: "px-6 py-3 rounded-full justify-center items-center flex whitespace-nowrap text-neutral-500 hover:bg-neutral-200 transition-colors duration-300 bg-white",
            label: "cursor-pointer",
            checkbox: "hidden",
            selectedItem: "!bg-ocean text-white rounded-full",
            count: "hidden",
          }}
        />
      </div>

      {/* Episodes Grid */}
      <Hits
        hitComponent={PodcastEpisodeHitComponent}
        classNames={{
          list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
        }}
      />
    </InstantSearch>
  );
};
