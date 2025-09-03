import { DynamicHero } from "~/components";
import { Articles } from "./partials/articles.partial";
import { Article } from "./loader";

export function AllArticlesPage({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const category = selectedCategory || "Articles";

  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        customTitle={`${category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}`}
        imagePath="/assets/images/articles-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      />

      <div className="max-w-screen-content w-full mx-auto">
        <Articles />
      </div>
    </div>
  );
}
