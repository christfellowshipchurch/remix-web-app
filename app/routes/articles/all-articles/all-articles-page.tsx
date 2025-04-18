import { DynamicHero } from "~/components";
import { LatestArticles } from "./partials/latest.partial";
import { Articles } from "./partials/articles.partial";

export function AllArticlesPage() {
  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="/assets/images/articles-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      />
      <div className="content-padding py-16 lg:pt-32 lg:pb-24">
        <div className="flex-col flex md:flex-row justify-between gap-8 max-w-screen-content">
          <Articles />
          <LatestArticles />
        </div>
      </div>
    </div>
  );
}
