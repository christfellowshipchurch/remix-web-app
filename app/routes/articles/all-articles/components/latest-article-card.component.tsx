import { Link } from "react-router";
import { ContentItemHit } from "~/routes/search/types";
import { Divider } from "../partials/latest.partial";

export const DesktopLatestArticleCard = ({ hit }: { hit: ContentItemHit }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Link
        to={`/articles/${hit.url || hit.routing.pathname}`}
        prefetch="intent"
        className="flex items-center gap-5 cursor-pointer"
      >
        <img
          src={hit.coverImage.sources[0].uri}
          className="size-18 object-cover rounded-[4px] overflow-hidden"
        />
        <div className="flex flex-col max-w-[220px]">
          <p className="text-sm text-[#444]">
            {new Date(hit.startDateTime).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h3 className="font-semibold text-lg leading-snug">{hit.title}</h3>
        </div>
      </Link>
      <Divider />
    </div>
  );
};

export const MobileLatestArticleCard = ({ hit }: { hit: ContentItemHit }) => {
  return (
    <Link
      to={`/articles/${hit.url || hit.routing.pathname}`}
      prefetch="intent"
      className="flex items-center gap-5 cursor-pointer"
    >
      <img
        src={hit.coverImage.sources[0].uri}
        className="size-16 object-cover rounded-[4px] overflow-hidden"
      />
      <div className="flex flex-col max-w-[220px]">
        <p className="text-sm text-[#444]">
          {new Date(hit.startDateTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h3 className="font-semibold text-lg leading-snug">{hit.title}</h3>
      </div>
    </Link>
  );
};
