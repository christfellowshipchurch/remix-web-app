import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "./loader";
import { FinderSingleHero } from "./partials/finder-single-hero.partial";

import { GroupSingleBasicContent } from "./components/basic-content.component";
import { RelatedGroupsPartial } from "./partials/related-groups.partial";
import { InstantSearch } from "react-instantsearch";
import { useMemo } from "react";
import { Button } from "~/primitives/button/button.primitive";

import { SearchWrapper } from "./components/search-wrapper.component";
import { GroupType } from "../group-finder/types";
import { createSearchClient } from "~/lib/create-search-client";
import { GroupSingleBanner } from "./components/group-single-banner.component";

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

export const GroupSingleContent = ({ hit }: { hit: GroupType }) => {
  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      {/* Banner */}
      <GroupSingleBanner
        language={hit.language}
        leaderImages={hit.leaders.map((leader) => leader.photo)}
        topics={hit.topics}
        groupName={hit.title}
      />

      {/* Hero */}
      <FinderSingleHero hit={hit} />

      <div className="content-padding w-full flex justify-center">
        <div className="justify-center flex flex-col gap-12 pt-10 lg:pt-16 w-full max-w-screen-content">
          <GroupSingleBasicContent summary={hit.summary} />
        </div>
      </div>
      <RelatedGroupsPartial topics={hit.topics} />
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
      indexName="dev_daniel_Groups"
      searchClient={searchClient}
      initialUiState={{
        dev_daniel_Groups: {
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
