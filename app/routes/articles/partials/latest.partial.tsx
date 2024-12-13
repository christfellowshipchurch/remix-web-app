import { useLoaderData } from "@remix-run/react";
import { ArticlesReturnType } from "../loader";

export const Divider = () => <div className="bg-black/30 w-full h-[1px]" />;

export const LatestArticles = () => {
  const { recentArticles: articles } = useLoaderData<ArticlesReturnType>();

  return (
    <div className="flex flex-col gap-6 p-8 border min-w-96 border-[#DCDCDC]">
      <h2 className="font-extrabold text-2xl">Latest Posts</h2>
      <Divider />
      {articles &&
        articles.length > 0 &&
        articles.map((article, i) => (
          <div key={i}>
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
      <div>
        <h2 className="font-extrabold text-2xl">Article Category</h2>
      </div>
    </div>
  );
};
