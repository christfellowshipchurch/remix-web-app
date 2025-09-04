import { useState, useEffect } from "react";
import { useHits } from "react-instantsearch";
import { ContentItemHit } from "~/routes/search/types";
import { ArticleCard } from "../components/article-card.component";
import { CustomPagination } from "~/components/custom-pagination";
import { HubsTagsRefinementList } from "~/components/hubs-tags-refinement";
import { ArticlesCardsLoadingSkeleton } from "../components/loading-skeleton.component";

export const Articles = ({
  setAllArticlesLoading,
}: {
  setAllArticlesLoading: (articlesLoading: boolean) => void;
}) => {
  const { items } = useHits<ContentItemHit>();
  const [articlesLoading, setArticlesLoading] = useState(true);

  // Set loading to false when items are available
  useEffect(() => {
    if (items && items.length > 0) {
      setArticlesLoading(false);
      setAllArticlesLoading(false);
    }
  }, [items]);
  return (
    <>
      {/* Mobile Layout with Local Filtering */}
      <div className="md:hidden">
        <div className="flex flex-col gap-8 pl-5 py-8 lg:pt-28 lg:pb-24">
          <HubsTagsRefinementList
            tagName="articlePrimaryTags"
            wrapperClass="flex flex-nowrap px-1 pb-1 overflow-x-auto scrollbar-hide"
            buttonClassDefault="w-fit min-w-[180px] flex justify-between group px-2 border-b-3 transition-colors"
            buttonClassSelected="border-ocean text-ocean"
            buttonClassUnselected="border-neutral-lighter text-text-secondary"
          />

          {articlesLoading || !items || items.length === 0 ? (
            <ArticlesCardsLoadingSkeleton />
          ) : (
            <div className="pr-5 md:px-0 grid grid-cols-1 xl:grid-cols-2 gap-y-4 xl:gap-x-8 xl:gap-y-16">
              {items.map((article, i) => (
                <ArticleCard article={article} key={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout with URL-based Filtering */}
      <div className="hidden md:block">
        <div className="content-padding pr-0 xl:pr-18 py-8 lg:pt-20 lg:pb-24 pagination-scroll-to">
          <div className="max-w-screen-content mx-auto flex flex-col w-full gap-12">
            <HubsTagsRefinementList tagName="articlePrimaryTags" />

            {/* {articlesLoading || !items || items.length === 0 ? (
              <ArticlesCardsLoadingSkeleton />
            ) : ( */}
            <div className="pr-12 lg:pr-18 grid grid-cols-1 md:grid-cols-2 xl:!grid-cols-3 md:gap-x-4 gap-y-4 lg:gap-8 xl:gap-y-16">
              {items.map((article, i) => (
                <ArticleCard article={article} key={i} />
              ))}
            </div>
            {/* )} */}
            <div className="-mt-6">
              <CustomPagination />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
