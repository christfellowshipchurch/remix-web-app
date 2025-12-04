import { Link } from "react-router-dom";
import Icon from "~/primitives/icon";
import { ContentItemHit } from "~/routes/search/types";

export type ContentHitType = {
  url: string;
  title: string;
  contentType: string;
};

export type HitContentType =
  | "Article"
  | "Event"
  | "Page Builder"
  | "Ministry Page"
  | "Redirect Card"
  | "Sermon"
  | "Person";

const getIconName = (hit: ContentHitType) => {
  switch (hit.contentType) {
    case "Article":
      return "file";
    case "Event":
      return "calendarAlt";
    case "Page Builder":
    case "Ministry Page":
    case "Redirect Card":
      return "windowAlt";
    case "Sermon":
      return "moviePlay";
    case "Person":
      return "user";
    case "Podcast":
      return "microphone";
    default:
      return "file"; // Fallback icon
  }
};

export const getPathname = (
  contentType: HitContentType,
  pathname: string,
  hit?: ContentItemHit
): string => {
  if (!contentType || !pathname || pathname === "") {
    return pathname;
  }

  const contentTypeLower = contentType.toLowerCase();

  let podcastShow = "so-good-sisterhood";
  if (hit) {
    podcastShow =
      hit.podcastShow?.toLowerCase().replace(/ /g, "-").replace(/\+/g, "and") ||
      "so-good-sisterhood";
  }

  // Redirect card and page builder - just use pathname (no contentType prefix)
  if (
    contentTypeLower === "redirect card" ||
    contentTypeLower === "page builder"
  ) {
    return `/${pathname}`;
  }

  // Ministry Page - set to "messages"
  if (contentTypeLower === "ministry page") {
    return `/ministries/${pathname}`;
  }

  // Sermon - set to "messages"
  if (contentTypeLower === "sermon") {
    return `/messages/${pathname}`;
  }

  // Podcasts - set to "messages"
  if (contentTypeLower === "podcast") {
    return `/podcasts/${podcastShow}/${pathname}`;
  }

  // Articles - ensure it's "articles" (add "s" if singular)
  if (contentTypeLower === "article") {
    return `/articles/${pathname}`;
  }

  // Events - ensure it's "events" (add "s" if singular)
  if (contentTypeLower === "event") {
    return `/events/${pathname}`;
  }

  // Default: use contentType as-is (lowercased)
  return `/${contentType.toLowerCase()}/${pathname}`;
};

export function ContentHit({
  hit,
  query,
}: {
  hit: ContentItemHit;
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

  const hitPath = getPathname(
    hit.contentType as HitContentType,
    hit.url || "",
    hit as ContentItemHit
  );

  return (
    <Link
      to={hitPath}
      prefetch="intent"
      className="my-2 flex gap-2 hover:translate-x-1 transition-transform duration-300"
    >
      <Icon name={iconName} color="#666666" size={28} />
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">
          {highlightQuery(hit.title, query)}
        </h3>
        <p className="text-[10px] text-text-secondary font-medium">
          {hit.contentType === "Page Builder"
            ? "Resources"
            : hit.contentType === "Ministry Page"
            ? "Ministry"
            : hit.contentType}
        </p>
      </div>
    </Link>
  );
}
