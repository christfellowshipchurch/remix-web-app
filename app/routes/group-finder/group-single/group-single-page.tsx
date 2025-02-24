import { useLoaderData } from "react-router";
import { LoaderReturnType } from "./loader";
import { GroupsSingleHero } from "./partials/hero.partial";
import Breadcrumbs from "~/components/breadcrumbs";
import { GroupSingleBasicContent } from "./components/basic-content.component";
import { GroupSingleSidebar } from "./components/sidebar.component";
import { RelatedGroupsPartial } from "./partials/related-groups.partial";

export function GroupSinglePage() {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <section className="flex flex-col items-center dark:bg-gray-900">
      <GroupsSingleHero imagePath={data.coverImage} />
      <div className="content-padding w-full flex flex-col items-center">
        <div className="flex flex-col gap-12 pt-16 w-full max-w-screen-content">
          <Breadcrumbs />
          <div className="w-full flex gap-20">
            <GroupSingleBasicContent />
            <GroupSingleSidebar />
          </div>
        </div>
      </div>
      <RelatedGroupsPartial />
    </section>
  );
}
