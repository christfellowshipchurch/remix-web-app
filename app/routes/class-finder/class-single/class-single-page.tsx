import { Link, useLoaderData, useLocation } from "react-router-dom";
import { LoaderReturnType } from "./loader";
import { Breadcrumbs } from "~/components";

import { ClassSingleBasicContent } from "./components/basic-content.component";
import { ClassFAQ } from "./components/faq.component";
import { Configure, InstantSearch, useHits } from "react-instantsearch";
import { useMemo } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { UpcomingSessionsSection } from "./partials/upcoming-sections.partial";
import { UpcomingSessionMobileSection } from "./partials/upcoming-session-mobile.partial";
import { createSearchClient } from "~/lib/create-search-client";
import { ClassHitType } from "../types";

const ClassNotFound = () => {
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

const ClassSingleContent = ({ hit }: { hit: ClassHitType }) => {
  const location = useLocation();
  const backToClassFinderUrl =
    typeof location.state?.fromClassFinder === "string"
      ? location.state.fromClassFinder
      : "/class-finder";

  const { subtitle, classType, topic } = hit;

  if (!hit) {
    return <ClassNotFound />;
  }

  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      <img
        src={hit.coverImage.sources[0].uri}
        alt={hit.title}
        className="w-full h-[250px] lg:h-[500px] object-cover overflow-hidden flex-shrink-0"
      />

      {/* Content */}
      <div className="content-padding w-full flex flex-col items-center">
        <div className="flex flex-col gap-12 pt-10 w-full max-w-screen-content">
          {/* Breadcrumbs */}
          <div className="flex gap-6 items-center">
            <Link
              className="cursor-pointer text-text-secondary hover:text-ocean flex items-center gap-2"
              to={backToClassFinderUrl}
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
            <ClassSingleBasicContent
              topic={topic}
              summary={subtitle}
              classTitle={classType}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col">
        {/* Desktop Upcoming Sessions Section */}
        <UpcomingSessionsSection />

        {/* Mobile Upcoming Sessions Section */}
        <UpcomingSessionMobileSection />

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
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, classUrl } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <InstantSearch
      indexName="dev_Classes"
      searchClient={searchClient}
      initialUiState={{
        dev_Classes: {
          query: `${classUrl}`,
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      key={classUrl}
    >
      {/* Name of Class */}
      <Configure
        hitsPerPage={1}
        queryType="prefixNone"
        removeWordsIfNoResults="none"
        typoTolerance={false}
        exactOnSingleWordQuery="word"
        filters={`classTypeUrl:"${classUrl}"`}
      />

      <CustomClassSingleHits />
    </InstantSearch>
  );
}

const CustomClassSingleHits = () => {
  const { items } = useHits<ClassHitType>();

  return (
    <div className="w-full">
      {items.length > 0 ? (
        items.map((hit) => <ClassSingleContent key={hit.objectID} hit={hit} />)
      ) : (
        <ClassNotFound />
      )}
    </div>
  );
};
