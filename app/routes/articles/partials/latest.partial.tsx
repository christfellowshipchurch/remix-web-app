import { useLoaderData } from "react-router";
import { Article, ArticlesReturnType } from "../loader";

export const Divider = () => <div className="bg-black/30 w-full h-[1px]" />;

export type Category = {
  amount: number;
  title: string;
  articles: Article[];
};

export const LatestArticles = () => {
  const { recentArticles: articles } = useLoaderData<ArticlesReturnType>();
  const mockCategories: Category[] = [
    { amount: 12, title: "Study The Bible", articles: [] },
    { amount: 7, title: "Spiritual Growth", articles: [] },
    { amount: 4, title: "Personal Growth", articles: [] },
    { amount: 8, title: "Relationships", articles: [] },
    { amount: 10, title: "Prayers", articles: [] },
  ];

  return (
    <div className="flex flex-col h-full gap-6 p-8 border min-w-96 border-[#DCDCDC]">
      <h2 className="font-extrabold text-2xl">Latest Posts</h2>
      <Divider />
      {articles &&
        articles.length > 0 &&
        articles.map((article, i) => (
          <div key={i} className="flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <img src={article.image} className="size-18 object-cover" />
              <div className="flex flex-col max-w-[220px]">
                <p className="text-sm text-[#444]">{article.startDate}</p>
                <h3 className="font-semibold text-lg leading-snug">
                  {article.title}
                </h3>
              </div>
            </div>
            <Divider />
          </div>
        ))}
      <div className="flex flex-col gap-8">
        <h2 className="font-extrabold text-2xl">Article Category</h2>
        <div className="flex flex-col gap-4">
          {mockCategories.map((category, i) => (
            <div key={i} className="flex justify-between">
              <h3 className="font-bold text-lg">{category.title}</h3>
              <p className="font-medium text-[#666666]">({category.amount})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
