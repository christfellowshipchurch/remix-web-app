import { useRouteLoaderData } from "react-router";
import { useMemo, useState, useEffect } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Configure, useHits, Hits } from "react-instantsearch";
import { ContentItemHit } from "~/routes/search/types";
import { RootLoaderData } from "~/routes/navbar/loader";
import { ArticleCard } from "../components/article-card.component";
import { DesktopLoadingSkeleton } from "../components/loading-skeleton.component";
import {
  MobileArticlesTagsRefinementList,
  DesktopArticlesTagsRefinementList,
} from "../components/articles-tags-refinement.component";
import { CustomPagination } from "~/components/custom-pagination";

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

export const Articles = () => {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };

  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <>
      {/* Mobile Layout with Local Filtering */}
      <div className="md:hidden">
        <MobileArticles searchClient={searchClient} />
      </div>

      {/* Desktop Layout with URL-based Filtering */}
      <div className="hidden md:block">
        <InstantSearch
          indexName="dev_daniel_contentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure
            filters={`contentType:"Article"`}
            hitsPerPage={12}
            distinct={true}
          />
          <div className="flex flex-col w-full gap-12 content-padding pr-0 py-8 lg:pt-20 lg:pb-24 pagination-scroll-to">
            <DesktopArticlesTagsRefinementList />
            <DesktopArticlesGrid />
            <div className="-mt-6">
              <CustomPagination />
            </div>
          </div>
        </InstantSearch>
      </div>
    </>
  );
};

const DesktopArticlesGrid = () => {
  const { items } = useHits<ContentItemHit>();

  const [articlesLoading, setArticlesLoading] = useState(true);
  // Used to delay slightly to ensure the snapping does not happen
  const [shouldSetArticlesLoadingOff, setShouldSetArticlesLoadingOff] =
    useState(false);

  // Set loading to false when items are available
  useEffect(() => {
    if (items && items.length > 0) {
      setShouldSetArticlesLoadingOff(true);
    }
  }, [items]);

  useEffect(() => {
    if (shouldSetArticlesLoadingOff) {
      setArticlesLoading(false);
      setShouldSetArticlesLoadingOff(false);
    }
  }, [shouldSetArticlesLoadingOff]);

  return (
    <div className="pr-12 lg:pr-18 grid grid-cols-1 md:grid-cols-2 xl:!grid-cols-3 md:gap-x-4 gap-y-4 lg:gap-8 xl:gap-y-16">
      {articlesLoading || !items || items.length === 0 ? (
        <DesktopLoadingSkeleton />
      ) : (
        <>
          {items.map((article, i) => (
            <ArticleCard article={article} key={i} />
          ))}
        </>
      )}
    </div>
  );
};

// Mobile component with local state filtering
const MobileArticles = ({ searchClient }: { searchClient: any }) => {
  return (
    <InstantSearch
      indexName="dev_daniel_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure
        filters={`contentType:"Article"`}
        hitsPerPage={10}
        distinct={true}
      />
      <div className="flex flex-col gap-8 pl-5 py-8 lg:pt-28 lg:pb-24">
        <MobileArticlesTagsRefinementList />

        <Hits
          hitComponent={({ hit }: { hit: ContentItemHit }) => (
            <ArticleCard article={hit} />
          )}
          classNames={{
            list: "pr-5 md:px-0 grid grid-cols-1 xl:grid-cols-2 gap-y-4 xl:gap-x-8 xl:gap-y-16",
          }}
        />
      </div>
    </InstantSearch>
  );
};
