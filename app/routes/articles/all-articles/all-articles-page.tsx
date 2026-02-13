import { DynamicHero } from "~/components";
import { AllArticles } from "./partials/all-articles.partial";

export function AllArticlesPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-none">
        <DynamicHero
          customTitle="Articles"
          imagePath="/assets/images/articles-hero-bg.jpg"
          ctas={[{ href: "/class-finder", title: "Take a Class" }]}
        />
      </div>
      <AllArticles />
    </div>
  );
}
