import { Link } from "react-router-dom";
import Icon from "~/primitives/icon";

export type ContentHitType = {
  routing?: {
    pathname: string;
  };
  title: string;
  contentType: string;
};

const getIconName = (hit: ContentHitType) => {
  // TODO: Update the type names once the new index is created in Algolia
  switch (hit.contentType) {
    case "Articles & Blogs":
      return "file";
    case "Digital Platform Events & Live Streams":
      return "calendarAlt";
    case "Page Builder":
    case "Location Pages [New]":
      return "windowAlt";
    case "Sermon":
      return "moviePlay";
    case "Person":
      return "user";
    case "So Good Sisterhood":
      return "microphone";
    default:
      return "file"; // Fallback icon
  }
};

export function ContentHit({
  hit,
  query,
}: {
  hit: ContentHitType;
  query: string | null;
}) {
  const iconName = getIconName(hit);

  const highlightQuery = (title: string, query: string | null) => {
    if (!query) return title;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-[#DAEAF1]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Link
      to={`/${hit?.routing?.pathname}`}
      prefetch="intent"
      className="my-2 flex gap-2 hover:translate-x-1 transition-transform duration-300"
    >
      <Icon name={iconName} color="#666666" size={28} />
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">
          {highlightQuery(hit.title, query)}
        </h3>
        <p className="text-[10px] text-text-secondary font-medium">
          {hit.contentType}
        </p>
      </div>
    </Link>
  );
}
