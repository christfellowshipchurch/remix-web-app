import { useLoaderData, useNavigate } from "react-router";
import { LoaderReturnType } from "./loader";
import { GroupsSingleHero } from "./partials/hero.partial";
import Breadcrumbs from "~/components/breadcrumbs";
import { GroupSingleBasicContent } from "./components/basic-content.component";
import { GroupSingleSidebar } from "./components/sidebar.component";
import { RelatedGroupsPartial } from "./partials/related-groups.partial";
import { GroupFAQ } from "./components/faq.component";
import {
  Configure,
  InstantSearch,
  SearchBox,
  useHits,
} from "react-instantsearch";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Hits } from "react-instantsearch";
import { useMemo } from "react";
import { GroupHit } from "../types";
import { Button } from "~/primitives/button/button.primitive";

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

const GroupSingleContent = ({ hit }: { hit: GroupHit }) => {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const tags = hit.preferences;

  if (!hit) {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <h2 className="text-2xl font-bold text-center">Group Not Found</h2>
        <p className="text-neutral-500 text-center max-w-md">
          We couldn't find the group you're looking for. It may have been
          removed or renamed.
        </p>
        <Button intent="primary" href="/group-finder">
          Browse All Groups
        </Button>
      </div>
    );
  }
  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      <GroupsSingleHero imagePath={coverImage} />
      <div className="content-padding w-full flex flex-col items-center">
        <div className="flex flex-col gap-12 pt-10 lg:pt-16 w-full max-w-screen-content">
          <Breadcrumbs />
          <div className="w-full flex flex-col items-center lg:flex-row lg:items-start lg:gap-20">
            <GroupSingleBasicContent
              tags={tags}
              groupName={hit.title}
              summary={hit.summary}
            />
            <GroupSingleSidebar
              leaders={hit.leaders}
              meetingType={hit.meetingType}
              meetingTime={hit.meetingTime}
              meetingDay={hit.meetingDay}
              campusName={hit.campusName}
            />
            <div className="mt-10 lg:hidden w-full">
              <div className="flex flex-col gap-6 md:hidden mb-10">
                <h2 className="text-lg font-extrabold">About</h2>
                <p className="md:hidden">{hit.summary}</p>
              </div>
              <GroupFAQ />
            </div>
          </div>
        </div>
      </div>
      <RelatedGroupsPartial tags={tags} />
    </section>
  );
};
export function GroupSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, groupName } =
    useLoaderData<LoaderReturnType>();
  const navigate = useNavigate();

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  return (
    <InstantSearch
      indexName="production_Groups"
      searchClient={searchClient}
      initialUiState={{
        production_Groups: {
          query: `${groupName}`,
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure hitsPerPage={1} />
      <SearchBox
        classNames={{
          root: "opacity-0 size-0 absolute",
        }}
        defaultValue={groupName}
      />
      {/* Results (Group Single Page) */}
      <Hits
        hitComponent={GroupSingleContent}
        classNames={{
          list: "w-full",
          root: "w-full",
        }}
      />
    </InstantSearch>
  );
}
