import { DynamicHero } from "~/components/dynamic-hero";
import { LatestArticles } from "./partials/latest.partial";
import { Articles } from "./partials/articles.partial";

export function AllArticlesPage() {
  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="../app/assets/images/articles-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      />
      <div className="flex-col flex md:flex-row justify-between gap-8 max-w-[1600px] md:px-8 lg:px-20 xl:px-36 py-28">
        <Articles />
        <LatestArticles />
      </div>
    </div>
  );
}
