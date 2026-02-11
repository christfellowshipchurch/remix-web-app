import { useLoaderData, useSearchParams, useLocation } from "react-router-dom";
import {
  InstantSearch,
  Configure,
  useHits,
  useInstantSearch,
} from "react-instantsearch";
import { useMemo, useState, useEffect, useRef } from "react";

import { ContentItemHit } from "~/routes/search/types";
import { CustomPagination } from "~/components/custom-pagination";
import { HubsTagsRefinementList } from "~/components/hubs-tags-refinement";
import { createSearchClient } from "~/lib/create-search-client";
import { AllArticlesReturnType } from "../loader";
import { ArticleCard } from "../components/article-card.component";
import { useResponsive } from "~/hooks/use-responsive";
import { parseAllArticlesUrlState } from "../all-articles-url-state";
import {
  createAllArticlesInstantSearchRouter,
  createAllArticlesStateMapping,
} from "../all-articles-instantsearch-router";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";

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

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseAllArticlesUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

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

          {allArticlesLoading && <AllArticlesLoadingSkeleton />}

          {/* Results Grid */}
          <div className="min-h-[320px]">
            <AllArticlesHit setAllArticlesLoading={setAllArticlesLoading} />
          </div>
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
  const { status } = useInstantSearch();

  useEffect(() => {
    if (status === "idle") {
      setAllArticlesLoading(false);
    }
  }, [status, setAllArticlesLoading]);

  if (items.length === 0) {
    return (
      <p className="text-text-secondary text-center py-8">
        No articles found. Try adjusting your filters or search.
      </p>
    );
  }

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
