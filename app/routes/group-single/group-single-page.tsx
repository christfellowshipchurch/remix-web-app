import { LoaderReturnType } from "./loader";
import { GroupSingleHero } from "./partials/group-single-hero.partial";

import { GroupSingleBasicContent } from "./components/basic-content.component";
import { RelatedGroupsPartial } from "./partials/related-groups.partial";
import { useHits, useInstantSearch } from "react-instantsearch";
import { useEffect, useState } from "react";
import { Button } from "~/primitives/button/button.primitive";

import { GroupType } from "../group-finder/types";
import { GroupSingleBanner } from "./components/group-single-banner.component";

export const GroupNotFound = () => {
  const { items } = useHits<GroupType>();
  const { status } = useInstantSearch();
  const [loadingStarted, setLoadingStarted] = useState<boolean>(false);
  const [loadingFinished, setLoadingFinished] = useState<boolean>(false);

  useEffect(() => {
    if (status === "loading") {
      setLoadingStarted(true);
    }
    if (status === "idle" && loadingStarted) {
      setLoadingFinished(true);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="heading-h4 flex flex-col items-center justify-center gap-6 py-20 h-[70vh] w-screen">
        Loading Group...
      </div>
    );
  }

  if (items.length < 1 && status === "idle" && loadingFinished) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-[70vh] w-screen">
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

  return null;
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
      <GroupSingleHero hit={hit} />

      <div className="content-padding w-full flex justify-center">
        <div className="justify-center flex flex-col gap-12 pt-10 lg:pt-16 w-full max-w-screen-content">
          <GroupSingleBasicContent summary={hit.summary} />
        </div>
      </div>
      <RelatedGroupsPartial topics={hit.topics} currentGroupName={hit.title} />
    </section>
  );
};

export function GroupSinglePage({
  loaderData,
}: {
  loaderData: LoaderReturnType;
}) {
  const { group } = loaderData;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure the component is mounted before starting animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isVisible ? "animate-fadeIn duration-400" : "opacity-0"
      }`}
    >
      {group ? <GroupSingleContent hit={group} /> : <GroupNotFound />}
    </div>
  );
}
