import { Link } from "react-router";
import { ContentItemHit } from "~/routes/search/types";

export const ArticleCard = ({ article }: { article: ContentItemHit }) => {
  const author = {
    fullName: `${article.author.firstName} ${article.author.lastName}`,
    photo: {
      uri: "/logo.png",
    },
  };

  return (
    <Link
      to={`/articles/${article.url || article.routing.pathname}`}
      prefetch="intent"
      className="flex flex-col rounded-lg overflow-hidden max-w-[462px] w-full border border-neutral-lighter transition-all duration-300 hover:-translate-y-1"
    >
      {/* Article Image */}
      <div className="relative">
        <img
          src={article.coverImage.sources[0].uri}
          className="w-full h-auto object-cover"
          alt={article.title}
        />

        {/* First Secondary Tag */}
        <div className="absolute top-3 left-4 bg-[#EEEEEE] rounded-[4px] p-1">
          {article.articleSecondaryTags[0] && (
            <p className="text-xs font-semibold">
              {article.articleSecondaryTags[0]}
            </p>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6 flex flex-col justify-between gap-4 h-full">
        {/* Article Title + Summary */}
        <div className="flex flex-col gap-2">
          <h3 className="font-extrabold text-lg break-words">
            {article.title}
          </h3>
          <p className="break-words">{article.summary}</p>
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
              {article.startDateTime && (
                <p>
                  {new Date(article.startDateTime).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {article.readTime && (
                    <span>
                      <span className="mx-2">•</span>
                      {/* TODO: This might not end up coming from Algolia, might need to get this from htmlContent length */}
                      {article.readTime} min read
                    </span>
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
