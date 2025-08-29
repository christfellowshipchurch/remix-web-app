import { useRouteLoaderData, useLocation, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Configure, useHits } from "react-instantsearch";
import { ContentItemHit } from "~/routes/search/types";
import { RootLoaderData } from "~/routes/navbar/loader";
import { articleCategories } from "../all-articles-page";
import { ArticleCard } from "../components/article-card.component";

const createSearchClient = (appId: string, apiKey: string) =>
  algoliasearch(appId, apiKey, {});

export const Articles = () => {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };
  const location = useLocation();
  const navigate = useNavigate();

  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  // Extract category from URL path
  const pathSegments = location.pathname.split("/");
  const categoryFromPath =
    pathSegments.length > 2 && pathSegments[1] === "articles"
      ? pathSegments[2]
      : null;

  // Build filter based on category
  const filter = categoryFromPath
    ? `contentType:"Article" AND articlePrimaryTags:"${categoryFromPath}"`
    : 'contentType:"Article"';

  return (
    <>
      {/* Mobile Layout with Local Filtering */}
      <div className="md:hidden">
        <MobileArticlesWithFiltering
          searchClient={searchClient}
          categoryFromPath={categoryFromPath}
        />
      </div>

      {/* Desktop Layout with URL-based Filtering */}
      <div className="hidden md:block">
        <InstantSearch
          indexName="dev_daniel_contentItems"
          searchClient={searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
        >
          <Configure filters={filter} hitsPerPage={20} distinct={true} />
          <ArticlesGrid />
        </InstantSearch>
      </div>
    </>
  );
};

const ArticlesGrid = () => {
  const { items } = useHits<ContentItemHit>();

  return (
    <div className="content-padding md:px-0 grid grid-cols-1 xl:grid-cols-2 gap-y-4 xl:gap-x-8 xl:gap-y-16">
      {items?.map((article, i) => (
        <ArticleCard article={article} key={i} />
      ))}
    </div>
  );
};

// Mobile component with local state filtering
const MobileArticlesWithFiltering = ({
  searchClient,
  categoryFromPath,
}: {
  searchClient: any;
  categoryFromPath: string | null;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryFromPath
  );

  // Build filter based on selected category
  const filter = selectedCategory
    ? `contentType:"Article" AND articlePrimaryTags:"${selectedCategory}"`
    : 'contentType:"Article"';

  return (
    <InstantSearch
      indexName="dev_daniel_contentItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure filters={filter} hitsPerPage={20} distinct={true} />
      <MobileArticlesGrid
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </InstantSearch>
  );
};

const MobileArticlesGrid = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}) => {
  const { items } = useHits<ContentItemHit>();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex overflow-x-auto pb-1 w-full max-w-screen content-padding [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <MobileArticleCategoryTab
          category="View All"
          isActive={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
        />
        {articleCategories.map((category, i) => (
          <MobileArticleCategoryTab
            category={category.title}
            key={i}
            isActive={selectedCategory === category.path}
            onClick={() => setSelectedCategory(category.path)}
          />
        ))}
      </div>

      <div className="content-padding md:px-0 grid grid-cols-1 xl:grid-cols-2 gap-y-4 xl:gap-x-8 xl:gap-y-16">
        {items?.map((article, i) => (
          <ArticleCard article={article} key={i} />
        ))}
      </div>
    </div>
  );
};

const MobileArticleCategoryTab = ({
  category,
  isActive,
  onClick,
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-fit min-w-[150px] flex justify-between group px-2 border-b-3 transition-colors ${
        isActive
          ? "border-ocean text-ocean"
          : "border-neutral-lighter text-text-secondary"
      }`}
    >
      <h3 className="font-semibold">{category}</h3>
    </button>
  );
};
