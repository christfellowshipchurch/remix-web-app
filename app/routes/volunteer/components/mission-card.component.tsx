import { Link } from "react-router-dom";

import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";

import type { Mission } from "../mission.types";

/** Category pill styles (Algolia `category` labels). */
function categoryBadgeClass(label: string): string {
  const key = label.toLowerCase().trim();

  if (key.includes("crisis")) {
    return "bg-[#F3E4E5] text-alert";
  }
  if (key.includes("hospitality")) {
    return "bg-ocean/12 text-ocean";
  }
  if (key.includes("outreach") || key.includes("community partnerships")) {
    return "bg-[#DCE5EB] text-navy";
  }
  if (key.includes("support") && key.includes("team")) {
    return "bg-[#E5F3F2] text-cotton-candy";
  }
  if (key.includes("work project")) {
    return "bg-[#E8E8EA] text-neutral-dark";
  }

  return "bg-neutral-lighter text-neutral-darker";
}

export function MissionCard({
  mission,
  className,
}: {
  mission: Mission;
  className?: string;
}) {
  const imageUri = mission.coverImage?.sources?.[0]?.uri ?? "";
  const categoryLabel = mission.category?.trim() ?? "";
  const detailTo = `/group-finder/${mission.objectID}`;

  return (
    <Link
      to={detailTo}
      prefetch="intent"
      className={cn(
        "group flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-16/10 w-full max-h-[156px] shrink-0 overflow-hidden rounded-t-2xl bg-neutral-lighter">
        {imageUri ? (
          <img
            src={imageUri}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-hidden p-5">
        <h3 className="text-lg font-extrabold leading-tight text-text-primary group-hover:text-ocean">
          {mission.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              categoryBadgeClass(categoryLabel),
            )}
          >
            {categoryLabel}
          </span>
          <span className="text-sm text-neutral-default">
            {mission.spotsLeft} spots left
          </span>
        </div>

        {mission?.opportunityType?.length ? (
          <div className="flex flex-wrap gap-2">
            {mission.opportunityType.slice(0, 2).map((opportunity, index) => (
              <span
                key={`${opportunity}-${index}`}
                className="rounded-[4px] bg-gray px-2.5 py-1 text-xs text-neutral-default"
              >
                {opportunity}
              </span>
            ))}
          </div>
        ) : null}

        <ul className="flex flex-col gap-2 text-sm text-neutral-darker">
          <li className="flex min-w-0 items-center gap-2">
            <Icon
              name="map"
              size={20}
              className="shrink-0 text-neutral-darker"
            />
            <span className="min-w-0 truncate">
              {mission.location?.city || mission.campus?.name || "—"}
            </span>
          </li>
          <li className="flex min-w-0 items-center gap-2">
            <Icon
              name="calendarAlt"
              size={20}
              className="shrink-0 text-neutral-darker"
            />
            <span className="min-w-0 truncate">{mission.day || "—"}</span>
          </li>
          <li className="flex min-w-0 items-center gap-2">
            <Icon
              name="timeFive"
              size={20}
              className="shrink-0 text-neutral-darker"
            />
            <span className="min-w-0 truncate">{mission.time || "—"}</span>
          </li>
        </ul>
      </div>
    </Link>
  );
}
