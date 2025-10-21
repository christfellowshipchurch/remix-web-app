import { Link, useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "./loader";
import { Breadcrumbs } from "~/components";

import { ClassSingleBasicContent } from "./components/basic-content.component";
import { ClassFAQ } from "./components/faq.component";
import { InstantSearch } from "react-instantsearch";
import { useMemo } from "react";
import { GroupType } from "../../group-finder/types";
import { Button } from "~/primitives/button/button.primitive";
import { SearchWrapper } from "./components/search-wrapper.component";
import { Icon } from "~/primitives/icon/icon";
import { FinderSingleHero } from "~/routes/group-single/partials/finder-single-hero.partial";
import { UpcomingSessionsSection } from "./partials/upcoming-sections.partial";
import { createSearchClient } from "~/lib/create-search-client";

export const ClassNotFound = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <h2 className="text-2xl font-bold text-center">Class Not Found</h2>
      <p className="text-neutral-500 text-center max-w-md">
        We couldn't find the class you're looking for. It may have been removed
        or renamed.
      </p>
      <Button intent="primary" href="/class-finder">
        Browse All Classes
      </Button>
    </div>
  );
};

export const ClassSingleContent = ({ hit }: { hit: GroupType }) => {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const topics = hit.topics;
  const { summary } = hit;

  if (!hit) {
    return <ClassNotFound />;
  }

  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      {/* Hero */}
      <FinderSingleHero imagePath={coverImage} height={496} />

      {/* Content */}
      <div className="content-padding w-full flex flex-col items-center">
        <div className="flex flex-col gap-12 pt-10 w-full max-w-screen-content">
          {/* Breadcrumbs */}
          <div className="flex gap-6 items-center">
            <Link
              className="cursor-pointer text-text-secondary hover:text-ocean flex items-center gap-2"
              to="/class-finder"
            >
              <Icon name="arrowBack" className="size-6" />
              <span className="hover:underline text-sm line-clamp-2 md:hidden">
                Back to Finder
              </span>
            </Link>
            <div className="hidden md:block">
              <Breadcrumbs />
            </div>
          </div>

          {/* Basic Content */}
          <div className="w-full flex flex-col items-center">
            <ClassSingleBasicContent tags={topics} summary={summary} />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col">
        {/* Upcoming Sessions Section */}
        <UpcomingSessionsSection />

        {/* FAQs */}
        <div className="content-padding w-full flex flex-col items-center">
          <div className="w-full max-w-screen-content mx-auto flex flex-col items-center">
            <ClassFAQ />
          </div>
        </div>
      </div>
    </section>
  );
};

export function ClassSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, className } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <InstantSearch
      indexName="dev_daniel_Groups"
      searchClient={searchClient}
      initialUiState={{
        dev_daniel_Groups: {
          query: `${className}`,
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      key={className}
    >
      {/* Name of Class */}
      <SearchWrapper className={className} />
    </InstantSearch>
  );
}
