import * as Avatar from "@radix-ui/react-avatar";
import { cva, VariantProps } from "class-variance-authority";
import { CircleLoader } from "~/primitives/loading-states/circle-loader.primitive";

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

const card = cva(["flex"], {
  variants: {
    // UPDATE
    size: {
      sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "px-4"],
      lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "px-6"],
    },
    underline: { true: ["underline"], false: [] },
  },
  defaultVariants: {
    size: "lg",
  },
});

export interface ArticleCardProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof card> {
  href?: string;
  title: string;
  description: string;
  image: string;
  author?: {
    fullName: string;
    photo: {
      uri: string;
    };
  };
  date: string;
  readTime: string;
}
