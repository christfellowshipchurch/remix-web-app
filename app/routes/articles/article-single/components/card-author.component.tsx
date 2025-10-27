import * as Avatar from "@radix-ui/react-avatar";
import { CircleLoader } from "~/primitives/loading-states/circle-loader.primitive";
import { AuthorProps } from "../partials/hero.partial";

export const CardAuthor = ({
  name,
  image,
  date,
  timeRead,
}: {
  name: string;
  image: string;
  date: string;
  timeRead: string;
}) => {
  return (
    <div className="flex">
      <Avatar.Root className="mr-4 flex cursor-pointer duration-300 hover:scale-105">
        <Avatar.Image
          className="size-12 md:size-16 rounded-full"
          src={image}
          alt={name}
        />
        <Avatar.Fallback className="flex size-full">
          <CircleLoader />
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="flex flex-col justify-center text-sm">
        <h5 className="mb-1 font-semibold text-[17px] leading-tight">
          {name && name}
        </h5>
        <p className="mr-4 flex gap-2 items-center">
          <span>{date && date}</span>{" "}
          <span className="text-xl leading-none">•</span>{" "}
          <span>{timeRead && `${timeRead} min`}</span>
        </p>
      </div>
    </div>
  );
};

export interface ArticleCardProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  title: string;
  description: string;
  image: string;
  author?: AuthorProps;
  date: string;
  readTime: string;
}
