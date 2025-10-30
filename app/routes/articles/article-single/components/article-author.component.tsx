import * as Avatar from "@radix-ui/react-avatar";
import { CircleLoader } from "~/primitives/loading-states/circle-loader.primitive";
import { AuthorProps } from "../partials/hero.partial";
import { Link } from "react-router-dom";

export default function ArticleAuthor({
  author,
  publishDate,
  readTime,
}: {
  author: AuthorProps;
  publishDate: string;
  readTime: number;
}) {
  let authorPathname = "christ-fellowship-team";
  if (
    author?.authorAttributes?.pathname &&
    author?.authorAttributes?.pathname !== "undefined"
  ) {
    authorPathname = author?.authorAttributes?.pathname;
  } else if (
    author?.authorAttributes?.authorId &&
    author?.authorAttributes?.authorId !== "undefined"
  ) {
    authorPathname = author?.authorAttributes?.authorId;
  }

  return (
    <div className="flex">
      <Link prefetch="intent" to={`/author/${authorPathname}`}>
        <Avatar.Root className="flex cursor-pointer duration-300 hover:scale-105">
          <Avatar.Image
            className="size-16 rounded-full"
            src={
              author?.photo?.uri ||
              "http://cloudfront.christfellowship.church/GetImage.ashx?guid=A62B2B1C-FDFF-44B6-A26E-F1E213285153"
            }
            alt={author?.fullName || "Christ Fellowship Church"}
          />
          <Avatar.Fallback className="flex size-full">
            <CircleLoader size={20} />
          </Avatar.Fallback>
        </Avatar.Root>
      </Link>

      <div className="ml-4 flex flex-col justify-center">
        <h2 className="semibold mb-2">
          By{" "}
          <Link
            to={`/author/${authorPathname}`}
            prefetch="intent"
            className="underline hover:text-text-secondary"
          >
            {author?.fullName || "Christ Fellowship Church"}
          </Link>
        </h2>
        <div className="flex text-neutral-500 font-normal">
          {publishDate && (
            <p>
              {publishDate}
              <span className="mx-2">•</span>
            </p>
          )}
          {readTime && <p>{readTime} min read</p>}
        </div>
      </div>
    </div>
  );
}
