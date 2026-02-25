import { Link } from "react-router";
import { ContentItemHit } from "~/routes/search/types";

const DEFAULT_COVER_IMAGE =
  "http://cloudfront.christfellowship.church/GetImage.ashx?guid=A62B2B1C-FDFF-44B6-A26E-F1E213285153";

export const ArticleCard = ({ article }: { article: ContentItemHit }) => {
  const coverImageUri =
    article?.coverImage?.sources?.[0]?.uri ?? DEFAULT_COVER_IMAGE;
  const secondaryCategory = article?.articleSecondaryCategories?.[0];

  const author = {
    fullName: `${
      article?.author?.firstName && article?.author?.lastName
        ? `${article.author.firstName} ${article.author.lastName}`
        : `Christ Fellowship Team`
    }`,

    profileImage: article?.author?.profileImage ?? DEFAULT_COVER_IMAGE,
  };

  return (
    <Link
      to={`/articles/${article?.url || article?.routing?.pathname || ""}`}
      prefetch="intent"
      className="flex flex-col overflow-hidden max-w-[456px] w-full transition-all duration-300 hover:-translate-y-1 h-full border border-neutral-lighter rounded-lg"
    >
      {/* Article Image */}
      <div className="relative">
        <img
          src={coverImageUri}
          className="w-full h-[200px] lg:h-[258px] xl:h-auto object-cover aspect-video object-center rounded-t-lg"
          alt={article.title}
        />

        {/* First Secondary Tag */}
        {secondaryCategory && (
          <div className="absolute top-3 left-4 bg-[#EEEEEE] rounded-[4px] p-1">
            <p className="text-xs font-semibold">{secondaryCategory}</p>
          </div>
        )}
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
            src={author?.profileImage || DEFAULT_COVER_IMAGE}
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
                  {article.articleReadTime && (
                    <span className="flex">
                      <span className="mx-2 md:hidden lg:block">•</span>
                      {article.articleReadTime} min read
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
