import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { Configure, InstantSearch, useHits } from "react-instantsearch";

import { escapeAlgoliaFilterString } from "~/components/finders/finder-algolia.utils";
import { FinderHero } from "~/components/finders/hero";
import { Button } from "~/primitives/button/button.primitive";
import { ClassFAQ } from "./components/faq.component";
import { LoaderReturnType } from "./loader";
import { ClassSingleUpcomingSearch } from "./partials/upcoming-sections.partial";
import { createSearchClient } from "~/lib/create-search-client";
import { ClassHitType } from "../types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildClassSingleHeroDescriptionHtml(summary: string): string {
  const safe = escapeHtml(summary);
  return (
    '<h2 style="font-size:28px;font-weight:800;margin-bottom:1rem;">What to Expect</h2>' +
    `<div class="class-single-hero-summary">${safe}</div>`
  );
}

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
  const { summary, classType, topic } = hit;

  const heroDescriptionHtml = useMemo(
    () => buildClassSingleHeroDescriptionHtml(summary),
    [summary],
  );

  const heroTitleHtml = useMemo(() => escapeHtml(classType ?? ""), [classType]);

  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      <div className="w-full flex-none">
        <FinderHero
          bgColor="white"
          bgImage={hit.coverImage.sources[0].uri}
          imageAlt={hit.title}
          title={heroTitleHtml}
          topic={topic}
          mobileDescription={heroDescriptionHtml}
          desktopDescription={heroDescriptionHtml}
          ctas={[
            {
              href: "#todo",
              title: "Discussion Guide",
              intent: "secondary",
              className: "text-base font-normal",
            },
            {
              href: "#todo",
              title: "Class Trailer",
              intent: "primary",
              className: "text-base font-normal",
            },
          ]}
        />
      </div>

      <div className="w-full flex flex-col border-t border-[#E8E8E8]">
        <ClassSingleUpcomingSearch
          classHeroCoverImageUri={hit.coverImage.sources[0].uri}
        />

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
