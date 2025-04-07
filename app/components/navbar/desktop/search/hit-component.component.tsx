import { Link } from "react-router-dom";
import Icon from "~/primitives/icon";
import type { Hit as AlgoliaHit } from "instantsearch.js";
import type { SendEventForHits } from "instantsearch.js/es/lib/utils";

export type HitProps = {
  routing?: {
    pathname: string;
  };
  title: string;
  contentType: string;
};

export function HitComponent({
  hit,
  sendEvent,
}: {
  hit: AlgoliaHit<HitProps>;
  sendEvent: SendEventForHits;
}) {
  const getIconName = () => {
    // TODO: Update the type names once the new index is created in Algolia
    switch (hit.contentType) {
      case "Articles & Blogs":
        return "file";
      case "Digital Platform Events & Live Streams":
        return "calendarAlt";
      case "Page Builder || Location Pages [New]":
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

  const iconName = getIconName();

  return (
    <Link
      to={`/${hit?.routing?.pathname || ""}`}
      prefetch="intent"
      className="flex gap-2 hover:translate-x-1 transition-transform duration-300"
      onClick={() => sendEvent("click", hit, "Result Clicked")}
    >
      <Icon name={iconName} size={24} />
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">{hit.title}</h3>
        <p className="text-[10px] text-[#666666] font-medium">
          {hit.contentType}
        </p>
      </div>
    </Link>
  );
}
