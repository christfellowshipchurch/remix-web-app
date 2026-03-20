import { Link, useLoaderData, useLocation } from "react-router-dom";
import { LoaderReturnType } from "./loader";
import { Breadcrumbs } from "~/components";

import { StudySingleBasicContent } from "./partials/basic-content.partial";
import { Configure, InstantSearch, useHits } from "react-instantsearch";
import { useMemo } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { createSearchClient } from "~/lib/create-search-client";
import { StudyHitType } from "../types";
import { CurriculumItem } from "./components/curriculum-item.component";

const StudyNotFound = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <h2 className="text-2xl font-bold text-center">Study Not Found</h2>
      <p className="text-neutral-500 text-center max-w-md">
        We couldn't find the study you're looking for. It may have been removed
        or renamed.
      </p>
      <Button intent="primary" href="/studies-and-resources">
        Browse All Studies and Resources
      </Button>
    </div>
  );
};

const StudySingleContent = ({ hit }: { hit: StudyHitType }) => {
  const location = useLocation();
  const backToStudiesFinderUrl =
    typeof location.state?.fromStudiesFinder === "string"
      ? location.state.fromStudiesFinder
      : "/studies-and-resources";

  if (!hit) {
    return <StudyNotFound />;
  }

  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      {hit?.coverImage?.sources[0]?.uri && (
        <img
          src={hit.coverImage.sources[0].uri}
          alt={hit.title}
          className="w-full h-[250px] lg:h-[500px] object-cover overflow-hidden shrink-0"
        />
      )}

      {/* Content */}
      <div className="content-padding w-full flex flex-col items-center">
        <div className="flex flex-col gap-12 pt-10 w-full max-w-screen-content">
          {/* Breadcrumbs */}
          <div className="flex gap-6 items-center">
            <Link
              className="cursor-pointer text-text-secondary hover:text-ocean flex items-center gap-2"
              to={backToStudiesFinderUrl}
            >
              <Icon name="arrowBack" className="size-6" />
              <span className="hover:underline text-sm line-clamp-2 md:hidden">
                Back to Studies and Resources Finder
              </span>
            </Link>
            <div className="hidden md:block">
              <Breadcrumbs />
            </div>
          </div>

          {/* Basic Content */}
          <div className="w-full flex flex-col items-center">
            <StudySingleBasicContent hit={hit} />
          </div>
        </div>
      </div>

      {/* Mobile Curriculum Section */}
      <div className="flex md:hidden flex-col gap-5.5 md:mt-12 pt-8 pb-12 content-padding bg-gray w-full">
        <h3 className="text-lg font-semibold text-black leading-tight">
          Curriculum
        </h3>
        <div className="flex flex-col gap-4">
          <CurriculumItem
            title="Week 1: Getting Started"
            subtitle="Release date: June 12, 2024"
            items={[
              {
                type: "Video",
                description: "Week 1: Getting Started",
                wistiaId: "wcs977y9ac",
              },
            ]}
          />
          <CurriculumItem
            title="Week 1: Getting Started"
            subtitle="Release date: June 12, 2024"
            items={[
              {
                type: "Video",
                description: "Week 1: Getting Started",
                wistiaId: "wcs977y9ac",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export function StudiesSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, studyUrl } =
    useLoaderData<LoaderReturnType>();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  return (
    <InstantSearch
      indexName="dev_StudiesAndResourcesItems"
      searchClient={searchClient}
      initialUiState={{
        dev_StudiesAndResourcesItems: {
          query: `${studyUrl}`,
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      key={studyUrl}
    >
      <Configure
        hitsPerPage={1}
        queryType="prefixNone"
        removeWordsIfNoResults="none"
        typoTolerance={false}
        exactOnSingleWordQuery="word"
      />

      <CustomStudySingleHits />
    </InstantSearch>
  );
}

const CustomStudySingleHits = () => {
  const { items } = useHits<StudyHitType>();

  return (
    <div className="w-full">
      {items.length > 0 ? (
        items.map((hit) => <StudySingleContent key={hit.objectID} hit={hit} />)
      ) : (
        <StudyNotFound />
      )}
    </div>
  );
};
