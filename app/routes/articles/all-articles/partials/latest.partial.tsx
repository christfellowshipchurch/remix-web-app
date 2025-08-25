import { Link, useLoaderData } from "react-router-dom";
import { Article, ArticlesReturnType } from "../loader";

export const Divider = ({
  bg = "black",
  opacity = "30%",
}: {
  bg?: string;
  opacity?: string;
}) => (
  <div
    style={{ backgroundColor: `${bg}` || undefined, opacity: `${opacity}` }}
    className="w-full h-[1px]"
  />
);

export type Category = {
  amount: number;
  title: string;
  articles: Article[];
};

export const mockCategories: Category[] = [
  { amount: 12, title: "Study The Bible", articles: [] },
  { amount: 7, title: "Spiritual Growth", articles: [] },
  { amount: 4, title: "Personal Growth", articles: [] },
  { amount: 8, title: "Relationships", articles: [] },
  { amount: 10, title: "Prayers", articles: [] },
];

export const DesktopLatestArticles = () => {
  const { recentArticles: articles } = useLoaderData<ArticlesReturnType>();

  return (
    <div className="flex flex-col h-full gap-6 p-8 border md:min-w-72 lg:min-w-96 border-[#DCDCDC]">
      <h2 className="font-extrabold text-2xl">Latest Posts</h2>
      <Divider />
      {articles &&
        articles.length > 0 &&
        articles.map((article, i) => (
          <div key={i} className="flex flex-col gap-6 w-full">
            <Link
              to={`/articles/${article.attributeValues.url.value}`}
              prefetch="intent"
              className="flex items-center gap-5 cursor-pointer"
            >
              <img
                src={article.image}
                className="size-18 object-cover rounded-[4px] overflow-hidden"
              />
              <div className="flex flex-col max-w-[220px]">
                <p className="text-sm text-[#444]">{article.startDate}</p>
                <h3 className="font-semibold text-lg leading-snug">
                  {article.title}
                </h3>
              </div>
            </Link>
            <Divider />
          </div>
        ))}

      <div className="flex flex-col gap-8">
        <h2 className="font-extrabold text-2xl">Article Category</h2>
        <div className="flex flex-col gap-4">
          {mockCategories.map((category, i) => (
            <Link
              to={`/articles/category/${category.title}`}
              prefetch="intent"
              key={i}
              className="flex justify-between group"
            >
              <h3 className="font-bold text-lg group-hover:text-text-secondary">
                {category.title}
              </h3>
              <p className="font-medium text-text-secondary">
                ({category.amount})
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MobileLatestArticles = () => {
  const { recentArticles: articles } = useLoaderData<ArticlesReturnType>();

  return (
    <div className="flex flex-col gap-3 w-full max-w-screen content-padding">
      <h2 className="font-extrabold text-2xl">Latest Posts</h2>

      <div className="flex pb-1 gap-3 w-full overflow-x-auto">
        {articles &&
          articles.length > 0 &&
          // Group articles into vertical pairs
          Array.from(
            { length: Math.ceil(articles.length / 2) },
            (_, groupIndex) => {
              const startIndex = groupIndex * 2;
              const groupArticles = articles.slice(startIndex, startIndex + 2);

              return (
                <div
                  key={groupIndex}
                  className="flex flex-col gap-6 max-w-[90vw] min-w-[300px]"
                >
                  {groupArticles.map((article, i) => (
                    <div key={startIndex + i}>
                      <Link
                        to={`/articles/${article.attributeValues.url.value}`}
                        prefetch="intent"
                        className="flex items-center gap-5 cursor-pointer"
                      >
                        <img
                          src={article.image}
                          className="size-16 object-cover rounded-[4px] overflow-hidden"
                        />
                        <div className="flex flex-col max-w-[220px]">
                          <p className="text-sm text-[#444]">
                            {article.startDate}
                          </p>
                          <h3 className="font-semibold text-lg leading-snug">
                            {article.title}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              );
            }
          )}
      </div>
    </div>
  );
};
