import { Event } from "~/routes/events/all-events/loader";
import { Icon } from "../icon/icon";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import HtmlRenderer from "../html-renderer";

type Resource = {
  startDate?: string;
  campus?: string;
  author?: string;
  speaker?: string;
  content?: string;
  image: string;
  title: string;
  attributeValues: { url: { value: string }; summary: { value: string } };
};

export const ResourceCard = ({
  resource,
  className,
}: {
  resource: Resource;
  className?: string;
}) => {
  const {
    content,
    startDate,
    campus,
    author,
    speaker,
    image,
    title,
    attributeValues,
  } = resource;

  return (
    <Link
      to={attributeValues.url.value}
      className={cn(
        "flex flex-col rounded-[1rem] w-full max-w-[456px] h-full border border-neutral-lighter overflow-hidden hover:translate-y-[-4px] transition-all duration-300",
        className
      )}
      prefetch="intent"
    >
      <img
        src={image}
        alt={title}
        className="w-full max-h-[200px] md:max-w-[456px] md:max-h-[277px] lg:min-h-[200px] aspect-video object-cover"
        loading="lazy"
      />

      <div className="flex flex-col gap-4 p-6 bg-white h-full">
        {(startDate || campus || author || speaker) && (
          <ul className="flex gap-2 md:gap-4">
            {startDate && (
              <li className="flex items-center gap-2">
                <Icon name="calendarAlt" color="black" />
                <p className="text-sm">{startDate}</p>
              </li>
            )}
            {campus && (
              <li className="flex items-center gap-2">
                <Icon name="map" color="black" />
                <p className="text-sm">{campus}</p>
              </li>
            )}
            {(author || speaker) && (
              <li className="flex items-center gap-2">
                <Icon name="user" color="black" />
                <p className="text-sm">{author || speaker}</p>
              </li>
            )}
          </ul>
        )}

        <div className="flex flex-col gap-2">
          <h4 className="font-extrabold text-lg leading-tight text-pretty">
            {title}
          </h4>

          {attributeValues.summary.value ? (
            <p>{attributeValues.summary.value}</p>
          ) : (
            <HtmlRenderer html={content || ""} className="line-clamp-3" />
          )}
        </div>
      </div>
    </Link>
  );
};
