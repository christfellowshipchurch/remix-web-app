import { DynamicHero } from "~/components";
import { Articles } from "./partials/articles.partial";
import { ArticlesLoadingSkeleton } from "./components/loading-skeleton.component";
import { useMemo, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch";
import { createSearchClient } from "~/lib/create-search-client";
import { AllArticlesReturnType } from "./loader";
import { useLoaderData } from "react-router";
import { useResponsive } from "~/hooks/use-responsive";

export function AllArticlesPage() {
  const data = useLoaderData<AllArticlesReturnType>();
  const { isSmall, isMedium, isLarge, isXLarge } = useResponsive();
  const [articlesLoading, setArticlesLoading] = useState(true);

  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = data ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };
  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

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
    <div className="flex flex-col items-center">
      <DynamicHero
        customTitle="Articles"
        imagePath="/assets/images/articles-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      />

      {articlesLoading && <LoadingSkeleton />}
      <InstantSearch
        indexName="dev_daniel_contentItems"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <Configure
          filters={`contentType:"Article"`}
          hitsPerPage={hitsPerPage}
          distinct={true}
        />

        <Articles setArticlesLoading={setArticlesLoading} />
      </InstantSearch>
    </div>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="content-padding pr-0 xl:pr-18 py-8 lg:pt-20 lg:pb-24">
      <div className="max-w-screen-content w-full mx-auto">
        <ArticlesLoadingSkeleton />
      </div>
    </div>
  );
};
