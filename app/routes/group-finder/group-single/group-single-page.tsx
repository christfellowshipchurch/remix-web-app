import { Link, useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "./loader";
import { FinderSingleHero } from "./partials/finder-single-hero.partial";
import { Breadcrumbs } from "~/components";

import { GroupSingleBasicContent } from "./components/basic-content.component";
import { GroupSingleSidebar } from "./components/sidebar.component";
import { RelatedGroupsPartial } from "./partials/related-groups.partial";
import { GroupFAQ } from "./components/faq.component";
import { InstantSearch } from "react-instantsearch";
import { useMemo } from "react";
import { GroupHit } from "../types";
import { Button } from "~/primitives/button/button.primitive";
import { createSearchClient } from "~/routes/messages/all-messages/components/all-messages.component";
import { SearchWrapper } from "./components/search-wrapper.component";
import { Icon } from "~/primitives/icon/icon";

export const GroupNotFound = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <h2 className="text-2xl font-bold text-center">Group Not Found</h2>
      <p className="text-neutral-500 text-center max-w-md">
        We couldn't find the group you're looking for. It may have been removed
        or renamed.
      </p>
      <Button intent="primary" href="/group-finder">
        Browse All Groups
      </Button>
    </div>
  );
};

export const GroupSingleContent = ({ hit }: { hit: GroupHit }) => {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const tags = hit.preferences;
  const {
    leaders,
    meetingType,
    dateTime: meetingTime,
    meetingDay,
    campusName,
    summary,
  } = hit;

  if (!hit) {
    return <GroupNotFound />;
  }
  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      <FinderSingleHero imagePath={coverImage} />
      <div className="content-padding w-full flex justify-center">
        <div className="flex flex-col gap-12 pt-10 lg:pt-16 w-full max-w-screen-content">
          <div className="flex gap-6 items-center">
            <Link
              className="cursor-pointer text-text-secondary hover:text-ocean flex items-center gap-2"
              to="/group-finder"
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

          <div className="w-full flex justify-center">
            <GroupSingleBasicContent
              tags={tags}
              groupName={hit.title}
              summary={summary}
            />
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
      key={groupName}
    >
      <SearchWrapper groupName={groupName} />
    </InstantSearch>
  );
}
