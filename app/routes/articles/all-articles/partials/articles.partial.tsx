import { Link, useLoaderData } from "react-router-dom";
import { Article, ArticlesReturnType } from "../loader";

export const Articles = () => {
  const { allArticles: articles } = useLoaderData<ArticlesReturnType>();

  // TODO: This Articles might turn into hits from Algolia
  return (
    <div className="content-padding md:px-0 grid grid-cols-1 xl:grid-cols-2 gap-y-4 xl:gap-x-8 xl:gap-y-16">
      {articles?.map((article, i) => (
        <ArticleCard article={article} key={i} />
      ))}
    </div>
  );
};

const ArticleCard = ({ article }: { article: Article }) => {
  const author = article.author || {
    fullName: "Christ Fellowship Church",
    photo: {
      uri: "/logo.png",
    },
  };

  return (
    <Link
      to={`/articles/${article.attributeValues.url.value}`}
      prefetch="intent"
      className="flex flex-col rounded-lg overflow-hidden max-w-[462px] w-full border border-neutral-lighter"
    >
      {/* Article Image */}
      <div className="relative">
        <img
          src={article.image}
          className="w-full h-auto object-cover"
          alt={article.title}
        />

        <div className="absolute top-3 left-3 bg-neutral-lightest p-2 rounded-[4px]">
          <p className="font-semibold text-sm">
            {/* TODO: Update to the Category */}
            {article.startDate.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6 flex flex-col justify-between gap-4 h-full">
        {/* Article Title + Summary */}
        <div className="flex flex-col gap-2">
          <h3 className="font-extrabold text-lg break-words">
            {article.title}
          </h3>
          <p className="break-words">{article.attributeValues.summary.value}</p>
        </div>

        {/* Article Author */}
        <div className="flex gap-4 items-center">
          {/* Author Image */}
          <img
            src={author?.photo?.uri}
            alt="Article icon"
            className="size-12 rounded-full object-cover"
          />

          {/* Author Name + Publish Date */}
          <div className="flex flex-col gap-1">
            <h4 className="font-semibold text-[17px] break-words">
              {author?.fullName}
            </h4>

            <div className="flex">
              {article.startDate && (
                <p>
                  {article.startDate}
                  {article.readTime > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      {article.readTime} min read
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
