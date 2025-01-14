import { Link } from "react-router";

export type AuthorArticleProps = {
  title: string;
  readTime: number;
  publishDate: string;
  coverImage: string;
  summary: string;
  url: string;
};

/**
 * Renders an author article component.
 *
 * @param {AuthorArticleProps} props - The props for the author article component.
 * @returns {JSX.Element} The rendered author article component.
 */
export function AuthorArticle({
  title,
  publishDate,
  readTime,
  summary,
  url,
  coverImage,
}: AuthorArticleProps) {
  return (
    <Link
      to={`/articles/${url}`}
      prefetch="intent"
      className="flex flex-col-reverse gap-y-4 border-b-2 lg:gap-x-2 xl:gap-x-0 border-neutral-300 py-4 hover:bg-neutral-100 lg:grid lg:grid-cols-3"
    >
      <div className="flex flex-col gap-2 sm:col-span-2 pr-14">
        <h2 className="text-2xl font-semibold text-pretty">{title}</h2>
        <div className="flex gap-2 text-sm font-light text-neutral-600">
          <p>{publishDate}</p> <p>•</p> <p>{`${readTime} min read`}</p>
        </div>
        <p className="font-light lg:max-w-[380px]">{summary}</p>
      </div>
      {coverImage && coverImage?.length > 0 && (
        <div className="relative h-44 w-full overflow-hidden rounded-lg sm:col-span-1 sm:h-32">
          <img
            src={`${coverImage}&width=500`}
            style={{ objectFit: "cover" }}
            alt={`Author Article - ${title}`}
            className="size-full"
          />
        </div>
      )}
    </Link>
  );
}

// Build out the AuthorBook and AuthorPodcast components here...
