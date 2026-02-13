import { Icon } from "../icon/icon";
import { Link } from "react-router-dom";
import { cn } from "~/lib/utils";
import HtmlRenderer from "../html-renderer";
import { CollectionItem } from "~/routes/page-builder/types";

export const ResourceCard = ({
  resource,
  className,
  linkState,
}: {
  resource: CollectionItem;
  className?: string;
  /** Optional state to pass to the Link (e.g. { fromEvents: '/events?q=...' } for back navigation). */
  linkState?: Record<string, unknown>;
}) => {
  const { summary, startDate, location, author, image, name, pathname } =
    resource;

  return (
    <Link
      to={pathname}
      state={linkState}
      className={cn(
        "flex flex-col w-full h-full overflow-hidden hover:translate-y-[-4px] transition-all duration-300 border border-neutral-lighter rounded-lg",
        className
      )}
      prefetch="intent"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-auto max-h-[200px] aspect-video object-cover md:max-w-[480px] md:max-h-[277px] lg:aspect-[41/27] rounded-t-[8px]"
        loading="lazy"
      />

      <div className="flex-1 flex flex-col gap-4 p-6 bg-white h-fit rounded-b-[8px]">
        {(startDate || location || author) && (
          <ul className="flex gap-2 md:gap-4 lg:flex-col lg:gap-2 xl:!gap-4 xl:!flex-row">
            {startDate && (
              <li className="flex items-center gap-2">
                <Icon name="calendarAlt" color="black" />
                <p className="text-sm">{startDate}</p>
              </li>
            )}
            {location && (
              <li className="flex items-center gap-2">
                <Icon name="map" color="black" />
                <p className="text-sm">{location}</p>
              </li>
            )}
            {author && (
              <li className="flex items-center gap-2">
                <Icon name="user" color="black" />
                <p className="text-sm">{author}</p>
              </li>
            )}
          </ul>
        )}

        <div className="flex flex-col gap-2">
          <h4 className="font-extrabold text-lg leading-tight text-pretty">
            {name}
          </h4>

          <HtmlRenderer html={summary || ""} className="line-clamp-3" />
        </div>
      </div>
    </Link>
  );
};
