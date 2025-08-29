import { Link, useRouteLoaderData, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Configure,
  useHits,
  useStats,
} from "react-instantsearch";
import { ContentItemHit } from "~/routes/search/types";
import { articleCategories } from "../all-articles-page";
import { RootLoaderData } from "~/routes/navbar/loader";

export const Divider = ({
  bg = "black",
  opacity = "30%",
}: {
  bg?: string;
  opacity?: string;
}) => (
  <div
    style={{ backgroundColor: `${bg}` || undefined, opacity: `${opacity}` }}
    className="w-full h-[1px]"
  />
);

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

export const DesktopLatestArticles = () => {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };
  const location = useLocation();

  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  // Extract category from URL path
  const pathSegments = location.pathname.split("/");
  const categoryFromPath =
    pathSegments.length > 2 && pathSegments[1] === "articles"
      ? pathSegments[2]
      : null;

  // Build filter based on category
  const filter = categoryFromPath
    ? `contentType:"Article" AND articlePrimaryTags:"${categoryFromPath}"`
    : 'contentType:"Article"';

  return (
    <div className="flex flex-col h-full gap-6 p-8 border md:min-w-72 lg:min-w-96 border-[#DCDCDC]">
      <h2 className="font-extrabold text-2xl">Latest Posts</h2>
      <Divider />
      <InstantSearch
        indexName="dev_daniel_contentItems"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure filters={filter} hitsPerPage={5} distinct={true} />
        <ArticlesList />
      </InstantSearch>

      <div className="flex flex-col gap-8">
        <h2 className="font-extrabold text-2xl">Article Category</h2>
        <div className="flex flex-col gap-4">
          {articleCategories.map((category, i) => (
            <Link
              to={`/articles/${category.path}`}
              prefetch="intent"
              key={i}
              className="flex justify-between group"
            >
              <h3 className="font-bold text-lg group-hover:text-text-secondary">
                {category.title}
              </h3>
              <CountDisplay
                searchClient={searchClient}
                filter={`contentType:"Article" AND articlePrimaryTags:"${category.path}"`}
              />
            </Link>
          ))}

          {/* If this page is a Category Page add a View All that Links to /articles */}

          <Link
            to={`/articles`}
            prefetch="intent"
            className="flex justify-between group"
          >
            <h3 className="font-bold text-lg group-hover:text-text-secondary">
              View All
            </h3>
            <CountDisplay
              searchClient={searchClient}
              filter='contentType:"Article"'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ArticlesList = () => {
  const { items } = useHits<ContentItemHit>();

  return (
    <>
      {items.map((hit, i) => (
        <DesktopArticleCard hit={hit} key={i} />
      ))}
    </>
  );
};

const DesktopArticleCard = ({ hit }: { hit: ContentItemHit }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Link
        to={`/articles/${hit.url || hit.routing.pathname}`}
        prefetch="intent"
        className="flex items-center gap-5 cursor-pointer"
      >
        <img
          src={hit.coverImage.sources[0].uri}
          className="size-18 object-cover rounded-[4px] overflow-hidden"
        />
        <div className="flex flex-col max-w-[220px]">
          <p className="text-sm text-[#444]">{""}</p>
          <h3 className="font-semibold text-lg leading-snug">{hit.title}</h3>
        </div>
      </Link>
      <Divider />
    </div>
  );
};

// Reusable component for displaying counts
const CountDisplay = ({
  searchClient,
  filter,
}: {
  searchClient: any;
  filter: string;
}) => {
  return (
    <InstantSearch
      indexName="dev_daniel_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure filters={filter} hitsPerPage={0} distinct={true} />
      <CountRenderer />
    </InstantSearch>
  );
};

const CountRenderer = () => {
  const { nbHits } = useStats();
  return <p className="font-medium text-text-secondary">({nbHits})</p>;
};

export const MobileLatestArticles = () => {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };
  const location = useLocation();

  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  // Extract category from URL path
  const pathSegments = location.pathname.split("/");
  const categoryFromPath =
    pathSegments.length > 2 && pathSegments[1] === "articles"
      ? pathSegments[2]
      : null;

  // Build filter based on category
  const filter = categoryFromPath
    ? `contentType:"Article" AND articlePrimaryTags:"${categoryFromPath}"`
    : 'contentType:"Article"';

  return (
    <div className="flex flex-col gap-3 w-full max-w-screen content-padding">
      <h2 className="font-extrabold text-2xl">Latest Posts</h2>

      <InstantSearch
        indexName="dev_daniel_contentItems"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure filters={filter} hitsPerPage={5} distinct={true} />
        <MobileArticlesList />
      </InstantSearch>
    </div>
  );
};

const MobileArticlesList = () => {
  const { items } = useHits<ContentItemHit>();

  return (
    <div className="flex pb-1 gap-3 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {items &&
        items.length > 0 &&
        // Group articles into vertical pairs
        Array.from({ length: Math.ceil(items.length / 2) }, (_, groupIndex) => {
          const startIndex = groupIndex * 2;
          const groupArticles = items.slice(startIndex, startIndex + 2);

          return (
            <div
              key={groupIndex}
              className="flex flex-col gap-6 max-w-[90vw] min-w-[300px]"
            >
              {groupArticles.map((article, i) => (
                <MobileArticleCard hit={article} key={startIndex + i} />
              ))}
            </div>
          );
        })}
    </div>
  );
};

const MobileArticleCard = ({ hit }: { hit: ContentItemHit }) => {
  return (
    <Link
      to={`/articles/${hit.url || hit.routing.pathname}`}
      prefetch="intent"
      className="flex items-center gap-5 cursor-pointer"
    >
      <img
        src={hit.coverImage.sources[0].uri}
        className="size-16 object-cover rounded-[4px] overflow-hidden"
      />
      <div className="flex flex-col max-w-[220px]">
        <p className="text-sm text-[#444]">{hit.startDateTime}</p>
        <h3 className="font-semibold text-lg leading-snug">{hit.title}</h3>
      </div>
    </Link>
  );
};
