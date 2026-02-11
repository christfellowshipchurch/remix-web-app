import { DynamicHero } from "~/components";
import { AllArticles } from "./partials/all-articles.partial";

export function AllArticlesPage() {
  return (
    <div className="flex min-h-[100svh] max-h-[100svh] flex-col overflow-hidden md:max-h-none md:min-h-0 md:overflow-visible">
      <div className="flex-none">
        <DynamicHero
          customTitle="Articles"
          imagePath="/assets/images/articles-hero-bg.jpg"
          ctas={[{ href: "/class-finder", title: "Take a Class" }]}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto md:overflow-visible">
        <AllArticles />
      </div>
    </div>
  );
}
