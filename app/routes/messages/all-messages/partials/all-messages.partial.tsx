import { useLoaderData, useSearchParams, useLocation } from "react-router-dom";
import {
  InstantSearch,
  Configure,
  useHits,
  useInstantSearch,
} from "react-instantsearch";
import { useMemo, useState, useEffect, useRef } from "react";

import { SectionTitle } from "~/components";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { ContentItemHit } from "~/routes/search/types";
import { CustomPagination } from "~/components/custom-pagination";
import {
  HubsTagsRefinementList,
  HubsTagsRefinementLoadingSkeleton,
} from "~/components/hubs-tags-refinement";
import { createSearchClient } from "~/lib/create-search-client";
import { AllMessagesLoaderReturnType } from "../loader";
import { parseAllMessagesUrlState } from "../all-messages-url-state";
import {
  createAllMessagesInstantSearchRouter,
  createAllMessagesStateMapping,
} from "../all-messages-instantsearch-router";
import { useScrollToSearchResultsOnLoad } from "~/hooks/use-scroll-to-search-results-on-load";

const INDEX_NAME = "dev_contentItems";

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md § Pattern B (routing). */
export function AllMessages() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<AllMessagesLoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const searchParamsRef = useRef(searchParams);
  const setSearchParamsRef = useRef(setSearchParams);
  const pathnameRef = useRef(location.pathname);
  const onUpdateCallbackRef = useRef<
    ((route: ReturnType<typeof parseAllMessagesUrlState>) => void) | null
  >(null);

  searchParamsRef.current = searchParams;
  setSearchParamsRef.current = setSearchParams;
  pathnameRef.current = location.pathname;

  const router = useMemo(
    () =>
      createAllMessagesInstantSearchRouter({
        searchParamsRef,
        setSearchParamsRef,
        pathnameRef,
        onUpdateCallbackRef,
      }),
    []
  );

  const stateMapping = useMemo(() => createAllMessagesStateMapping(), []);

  useEffect(() => {
    const cb = onUpdateCallbackRef.current;
    if (cb) cb(parseAllMessagesUrlState(searchParams));
  }, [searchParams]);

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  const routing = useMemo(
    () => ({
      router,
      stateMapping,
    }),
    [router, stateMapping]
  );

  const [allMessagesLoading, setAllMessagesLoading] = useState(true);

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseAllMessagesUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  return (
    <section className="relative py-32 min-h-screen bg-white content-padding pagination-scroll-to">
      <div className="relative max-w-screen-content mx-auto">
        <SectionTitle
          className="mb8"
          sectionTitle="all messages."
          title="Christ Fellowship Church Messages"
        />
        {allMessagesLoading && <AllMessagesLoadingSkeleton />}
        <InstantSearch
          indexName={INDEX_NAME}
          searchClient={searchClient}
          routing={routing}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure filters='contentType:"Sermon"' hitsPerPage={9} />

          {/* Filter Section */}
          <div className="mt-10 mb-12">
            <HubsTagsRefinementList tagName="sermonPrimaryCategories" />
          </div>

          {/* Results Grid */}
          <div className="min-h-[320px]">
            <AllMessagesHit setAllMessagesLoading={setAllMessagesLoading} />
          </div>
          <CustomPagination />
        </InstantSearch>
      </div>
    </section>
  );
}

const AllMessagesHit = ({
  setAllMessagesLoading,
}: {
  setAllMessagesLoading: (allMessagesLoading: boolean) => void;
}) => {
  const { items } = useHits<ContentItemHit>();
  const { status } = useInstantSearch();

  useEffect(() => {
    if (status === "idle") {
      setAllMessagesLoading(false);
    }
  }, [status, setAllMessagesLoading]);

  if (items.length === 0) {
    return (
      <p className="text-text-secondary text-center py-8">
        No messages found. Try adjusting your filters or search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:!gap-8 justify-center items-center">
      {items.map((hit) => (
        <MessageHit hit={hit} key={hit.objectID} />
      ))}
    </div>
  );
};

const MessageHit = ({ hit }: { hit: ContentItemHit }) => {
  const formattedDate = new Date(hit.startDateTime).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <ResourceCard
      resource={{
        id: hit.objectID,
        contentChannelId: "63", // MESSAGE type from builder-utils.ts
        contentType: "MESSAGES",
        author:
          hit?.author?.firstName && hit?.author?.lastName
            ? hit?.author?.firstName + " " + hit?.author?.lastName
            : "Christ Fellowship Team",
        image: hit.coverImage.sources[0].uri,
        name: hit.title,
        summary: hit.summary,
        pathname: `/messages/${hit.url}`,
        startDate: formattedDate,
      }}
    />
  );
};

const AllMessagesLoadingSkeleton = () => {
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
