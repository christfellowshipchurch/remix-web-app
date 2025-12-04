import { Link } from "react-router-dom";
import Icon from "~/primitives/icon";

export type MobileContentHitType = {
  routing: {
    pathname: string;
  };
  coverImage?: {
    sources?: {
      uri: string;
    }[];
  } | null;
  title: string;
  contentType: string;
  summary: string;
};

export function MobileContentHit({ hit }: { hit: MobileContentHitType }) {
  const imageUrl = hit.coverImage?.sources?.[0]?.uri || "";

  return (
    <Link
      to={`/${hit?.routing?.pathname || ""}`}
      className="flex gap-2 pb-2 w-full"
    >
      <img
        src={imageUrl}
        alt={hit.title}
        className="size-16 rounded-lg object-cover"
      />
      <div className="flex justify-between items-center gap-2 size-full border-b border-[#E0E0E0] pb-2">
        <div className="flex flex-col justify-center h-full text-sm text-black w-full">
          <h3 className="line-clamp-1">{hit.title}</h3>
          <p className="font-normal line-clamp-1">{hit.summary}</p>
          <p className="text-xs text-[#7B7380]">
            {hit.contentType === "Page Builder" ||
            hit.contentType === "Redirect Card"
              ? "Resource Page"
              : hit.contentType}
          </p>
        </div>

        <Icon name="chevronRight" size={32} color="black" />
      </div>
    </Link>
  );
}
