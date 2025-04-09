import { Link } from "react-router-dom";
import Icon from "~/primitives/icon";

type Hit = {
  routing: {
    pathname: string;
  };
  coverImage: {
    sources: {
      uri: string;
    }[];
  };
  title: string;
  contentType: string;
  summary: string;
};

export function HitComponent({ hit }: { hit: Hit }) {
  return (
    <Link
      to={`/${hit?.routing?.pathname || ""}`}
      className="flex gap-2 pb-2 w-full"
    >
      <img
        src={hit.coverImage.sources[0].uri}
        alt={hit.title}
        className="size-16 rounded-lg object-cover"
      />
      <div className="flex justify-between items-center gap-2 size-full border-b border-[#E0E0E0] pb-2">
        <div className="flex flex-col jusitfy-center h-full text-sm text-black w-full">
          <h3 className="line-clamp-1">{hit.title}</h3>
          <p className="font-normal line-clamp-1">{hit.summary}</p>
          <p className="text-xs text-[#7B7380]">{hit.contentType}</p>
        </div>

        <Icon name="chevronRight" size={32} color="black" />
      </div>
    </Link>
  );
}
