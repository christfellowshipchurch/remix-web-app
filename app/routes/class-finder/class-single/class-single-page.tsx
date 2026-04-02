import { Link, useLoaderData, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { Configure, InstantSearch, useHits } from "react-instantsearch";

import { Breadcrumbs } from "~/components";
import { escapeAlgoliaFilterString } from "~/components/finders/finder-algolia.utils";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { ClassFAQ } from "./components/faq.component";
import { LoaderReturnType } from "./loader";
import { ClassSingleUpcomingSearch } from "./partials/upcoming-sections.partial";
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
        className="w-full h-[250px] lg:h-[500px] object-cover overflow-hidden shrink-0"
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
        <ClassSingleUpcomingSearch />

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
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
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
        filters={`classType:"${escapeAlgoliaFilterString(classUrl)}"`}
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

function ClassSingleBasicContent({
  topic,
  classTitle,
  summary,
}: {
  topic: string;
  classTitle?: string;
  summary: string;
}) {
  return (
    <div className="w-full pb-12 lg:pb-16 xl:pb-20">
      <div className="flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px] lg:text-[52px] font-extrabold leading-tight">
            {classTitle}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm bg-gray-100 px-2 py-1 rounded-sm">
              {topic}
            </span>
          </div>
        </div>

        {/* What To Expect */}
        <div className="flex flex-col gap-4 md:gap-9">
          <h2 className="font-extrabold text-lg md:text-[28px]">
            What to Expect
          </h2>
          <p className="md:text-xl">{summary}</p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <Button intent="secondary" size="md" href="#todo">
              View Discussion Guide
            </Button>

            <Button intent="secondary" size="md" href="#todo">
              Watch Class Trailer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
