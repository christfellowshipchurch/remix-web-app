import { DynamicHero } from "~/components";
import { AllArticles } from "./partials/all-articles.partial";

export function AllArticlesPage() {
  return (
    <div>
      <DynamicHero
        customTitle="Articles"
        imagePath="/assets/images/articles-hero-bg.jpg"
        ctas={[{ href: "/class-finder", title: "Take a Class" }]}
      />
      <AllArticles />
    </div>
  );
}
