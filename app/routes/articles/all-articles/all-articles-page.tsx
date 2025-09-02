import { DynamicHero } from "~/components";
import {
  DesktopLatestArticles,
  MobileLatestArticles,
} from "./partials/latest.partial";
import { Articles } from "./partials/articles.partial";
import { Article } from "./loader";
import { useState } from "react";
import { DesktopLoadingSkeleton } from "./components/loading-skeleton.component";

export type Category = {
  amount: number;
  title: string;
  path: string;
  articles: Article[];
};

export const articleCategories: Category[] = [
  { amount: 12, title: "Well-Being", path: "well-being", articles: [] },
  { amount: 10, title: "Living It Out", path: "living-it-out", articles: [] },
  { amount: 8, title: "Relationships", path: "relationships", articles: [] },
  {
    amount: 7,
    title: "Spiritual Growth",
    path: "spiritual-growth",
    articles: [],
  },
  {
    amount: 4,
    title: "Personal Growth",
    path: "personal-growth",
    articles: [],
  },
];

export function AllArticlesPage({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const category = selectedCategory || "Articles";
  const [isLoading, setIsLoading] = useState(true);

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

      <div className="content-padding py-8 lg:pt-28 lg:pb-24">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col md:flex-row justify-between gap-8 2xl:gap-16 max-w-screen-content">
          {isLoading ? (
            <div className="content-padding md:px-0 grid grid-cols-1 xl:grid-cols-2 gap-y-4 xl:gap-x-8 xl:gap-y-16">
              <DesktopLoadingSkeleton />
            </div>
          ) : (
            <Articles />
          )}
          <DesktopLatestArticles setIsLoading={setIsLoading} />
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col gap-8 md:hidden">
          <MobileLatestArticles />

          <Articles />
        </div>
      </div>
    </div>
  );
}
