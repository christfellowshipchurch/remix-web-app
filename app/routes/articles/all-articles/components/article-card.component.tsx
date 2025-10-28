import { Link } from "react-router";
import { ContentItemHit } from "~/routes/search/types";

export const ArticleCard = ({ article }: { article: ContentItemHit }) => {
  const author = {
    fullName: `${
      article.author.firstName && article.author.lastName
        ? `${article.author.firstName} ${article.author.lastName}`
        : `Christ Fellowship Team`
    }`,

    profileImage: `${
      article?.author?.profileImge
        ? article?.author?.profileImge
        : "http://cloudfront.christfellowship.church/GetImage.ashx?guid=A62B2B1C-FDFF-44B6-A26E-F1E213285153"
    }`, // TODO: FIX TYPE NAMING HERE AND IN THE CONTENTITEMHIT TYPE FILE
  };

  return (
    <Link
      to={`/articles/${article.url || article.routing.pathname}`}
      prefetch="intent"
      className="flex flex-col p-[2px] overflow-hidden max-w-[462px] w-full transition-all duration-300 hover:-translate-y-1"
    >
      {/* Article Image */}
      <div className="relative">
        <img
          src={article.coverImage.sources[0].uri}
          className="w-full h-auto object-cover rounded-t-lg"
          alt={article.title}
        />

        {/* First Secondary Tag */}
        {article.articleSecondaryCategories[0] && (
          <div className="absolute top-3 left-4 bg-[#EEEEEE] rounded-[4px] p-1">
            <p className="text-xs font-semibold">
              {article.articleSecondaryCategories[0]}
            </p>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="p-6 flex flex-col justify-between gap-4 h-full border-x border-b border-neutral-lighter rounded-b-lg">
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
            src={author?.profileImage || "/logo.png"}
            alt="Author Profile Image"
            className="size-12 rounded-full object-cover"
          />

          {/* Author Name + Publish Date */}
          <div className="flex flex-col gap-1">
            <h4 className="font-semibold text-[17px] break-words">
              {author?.fullName}
            </h4>

            <div className="flex">
              {article.startDateTime && (
                <div className="flex md:flex-col lg:flex-row">
                  <p>
                    {new Date(article.startDateTime).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  {article.readTime && (
                    <span className="flex">
                      <span className="mx-2 md:hidden lg:block">•</span>
                      {article.readTime} min read
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
