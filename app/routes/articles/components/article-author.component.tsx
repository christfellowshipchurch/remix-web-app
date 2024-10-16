import * as Avatar from "@radix-ui/react-avatar";
import { CircleLoader } from "~/primitives/loaders/circle-loader.primitive";
import { AuthorProps } from "../partials/hero.partial";

export default function ArticleAuthor({
  author,
  publishDate,
  readTime,
}: {
  author: AuthorProps;
  publishDate: string;
  readTime: number;
}) {
  return (
    <div className="flex">
      <a href={`/author/${author?.authorAttributes?.authorId}`}>
        <Avatar.Root className="flex cursor-pointer duration-300 hover:scale-105">
          <Avatar.Image
            className="size-20 rounded-full"
            src={author?.photo?.uri}
            alt={author?.fullName}
          />
          <Avatar.Fallback className="flex size-full">
            <CircleLoader size={20} />
          </Avatar.Fallback>
        </Avatar.Root>
      </a>

      <div className="ml-4 flex flex-col justify-center">
        <h2>{author?.fullName || "Full Name"}</h2>
        <div className="flex">
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
