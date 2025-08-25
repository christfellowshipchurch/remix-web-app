import { DynamicHero } from "~/components";
import {
  DesktopLatestArticles,
  MobileLatestArticles,
  mockCategories,
} from "./partials/latest.partial";
import { Articles } from "./partials/articles.partial";
import { Link } from "react-router";

export function AllArticlesPage() {
  return (
    <div className="flex flex-col items-center">
      <DynamicHero
        imagePath="/assets/images/articles-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Call to Action" }]}
      />
      <div className="content-padding py-8 lg:pt-28 lg:pb-24">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col md:flex-row justify-between gap-8 2xl:gap-16 max-w-screen-content">
          <Articles />
          <DesktopLatestArticles />
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col gap-8 md:hidden">
          <MobileLatestArticles />

          {/* TODO: This might change to Algolia soon?*/}
          <div className="flex flex-col gap-8">
            <div className="flex overflow-x-auto pb-1 w-full max-w-screen content-padding">
              {mockCategories.map((category, i) => (
                <Link
                  to={`/articles/category/${category.title}`}
                  prefetch="intent"
                  key={i}
                  className="min-w-[170px] flex justify-between group px-2 border-b border-neutral-lighter "
                >
                  <h3 className="font-semibold">{category.title}</h3>
                </Link>
              ))}
            </div>
            <Articles />
          </div>
        </div>
      </div>
    </div>
  );
}
