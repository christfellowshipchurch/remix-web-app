import { DynamicHero } from "~/components";
import { AllArticles } from "./partials/all-articles.partial";
import { getImageUrl } from "~/lib/utils";

export function AllArticlesPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-none">
        <DynamicHero
          customTitle="Articles"
          overlay='full'
          imagePath={getImageUrl("3143898")}
          ctas={[{ href: "/class-finder", title: "Take a Class" }]}
        />
      </div>
      <AllArticles />
    </div>
  );
}
