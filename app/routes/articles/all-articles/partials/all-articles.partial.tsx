import { useLoaderData, useSearchParams, useLocation } from "react-router-dom";
import { InstantSearch, Configure, useHits } from "react-instantsearch";
import { useMemo, useState, useEffect, useRef } from "react";

import { ContentItemHit } from "~/routes/search/types";
import { CustomPagination } from "~/components/custom-pagination";
import {
  HubsTagsRefinementList,
  HubsTagsRefinementLoadingSkeleton,
} from "~/components/hubs-tags-refinement";
import { createSearchClient } from "~/lib/create-search-client";
import { AllArticlesReturnType } from "../loader";
import { ArticleCard } from "../components/article-card.component";
import { useResponsive } from "~/hooks/use-responsive";
import { parseAllArticlesUrlState } from "../all-articles-url-state";
import {
  createAllArticlesInstantSearchRouter,
  createAllArticlesStateMapping,
} from "../all-articles-instantsearch-router";

const INDEX_NAME = "dev_contentItems";

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B (routing). */
export function AllArticles() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<AllArticlesReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const searchParamsRef = useRef(searchParams);
  const setSearchParamsRef = useRef(setSearchParams);
  const pathnameRef = useRef(location.pathname);
  const onUpdateCallbackRef = useRef<
    ((route: ReturnType<typeof parseAllArticlesUrlState>) => void) | null
  >(null);

  searchParamsRef.current = searchParams;
  setSearchParamsRef.current = setSearchParams;
  pathnameRef.current = location.pathname;

  const router = useMemo(
    () =>
      createAllArticlesInstantSearchRouter({
        searchParamsRef,
        setSearchParamsRef,
        pathnameRef,
        onUpdateCallbackRef,
      }),
    []
  );

  const stateMapping = useMemo(() => createAllArticlesStateMapping(), []);

  useEffect(() => {
    const cb = onUpdateCallbackRef.current;
    if (cb) cb(parseAllArticlesUrlState(searchParams));
  }, [searchParams]);

  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  const routing = useMemo(
    () => ({
      router,
      stateMapping,
    }),
    [router, stateMapping]
  );

  const [allArticlesLoading, setAllArticlesLoading] = useState(true);
  const { isSmall, isMedium, isLarge, isXLarge } = useResponsive();

  const hitsPerPage = (() => {
    switch (true) {
      case isXLarge || isLarge:
        return 12;
      case isMedium:
        return 8;
      case isSmall:
        return 8;
      default:
        return 12;
    }
  })();

  return (
    <section className="relative pb-28 pt-18 min-h-screen bg-white content-padding pagination-scroll-to">
      <div className="relative max-w-screen-content mx-auto">
        {allArticlesLoading && <AllArticlesLoadingSkeleton />}
        <InstantSearch
          indexName={INDEX_NAME}
          searchClient={searchClient}
          routing={routing}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure
            filters={`contentType:"Article"`}
            hitsPerPage={hitsPerPage}
            distinct={true}
          />

          {/* Filter Section */}
          <div className="mt-10 mb-12">
            <HubsTagsRefinementList tagName="articlePrimaryCategories" />
          </div>

          {/* Results Grid */}
          <AllArticlesHit setAllArticlesLoading={setAllArticlesLoading} />

          <CustomPagination />
        </InstantSearch>
      </div>
    </section>
  );
}

const AllArticlesHit = ({
  setAllArticlesLoading,
}: {
  setAllArticlesLoading: (allArticlesLoading: boolean) => void;
}) => {
  const { items } = useHits<ContentItemHit>();

  useEffect(() => {
    if (items.length > 0) {
      setAllArticlesLoading(false);
    }
  }, [items, setAllArticlesLoading]);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:!gap-8 justify-center items-center">
      {items.map((hit) => (
        <ArticleHit hit={hit} key={hit.objectID} />
      ))}
    </div>
  );
};

const ArticleHit = ({ hit }: { hit: ContentItemHit }) => {
  return <ArticleCard article={hit} />;
};

const AllArticlesLoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 pt-8">
      <HubsTagsRefinementLoadingSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:!gap-8 justify-center items-center">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="w-[460px] h-[360px] bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
