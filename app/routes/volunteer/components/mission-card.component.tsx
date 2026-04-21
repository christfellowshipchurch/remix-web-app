import { Link } from "react-router-dom";

import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";

import type { Mission } from "../mission.types";

function primaryOpportunityType(hit: Mission): string {
  const [first] = hit.opportunityType ?? [];
  return first?.trim() || "Volunteer";
}

function opportunityBadgeClass(label: string): string {
  const key = label.toLowerCase();
  if (key.includes("crisis")) return "bg-red-100 text-red-900";
  if (key.includes("hospitality")) return "bg-teal-100 text-teal-900";
  if (key.includes("food") || key.includes("meal"))
    return "bg-sky-100 text-sky-900";
  return "bg-neutral-lighter text-neutral-darker";
}

function categoryTokens(category: string): string[] {
  if (!category?.trim()) return [];
  return category
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function MissionCard({
  mission,
  className,
  showAvatarStack,
}: {
  mission: Mission;
  className?: string;
  /** Design accent: overlapping avatars on the first card. */
  showAvatarStack?: boolean;
}) {
  const imageUri = mission.coverImage?.sources?.[0]?.uri ?? "";
  const opportunity = primaryOpportunityType(mission);
  const categories = categoryTokens(mission.category);
  const detailTo = `/group-finder/${mission.objectID}`;

  return (
    <Link
      to={detailTo}
      prefetch="intent"
      className={cn(
        "group flex w-[85vw] max-w-[360px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg md:w-[347px]",
        className,
      )}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-t-2xl bg-neutral-lighter">
        {imageUri ? (
          <img
            src={imageUri}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-extrabold leading-tight text-text-primary group-hover:text-ocean">
          {mission.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              opportunityBadgeClass(opportunity),
            )}
          >
            {opportunity}
          </span>
          <span className="text-sm text-neutral-default">
            {mission.spotsLeft} spots left
          </span>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-lighter px-2.5 py-1 text-xs font-semibold text-neutral-darker"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <ul className="flex flex-col gap-2 text-sm text-neutral-darker">
          <li className="flex items-center gap-2">
            <Icon
              name="map"
              size={20}
              className="shrink-0 text-neutral-default"
            />
            <span>{mission.location?.city || mission.campus?.name || "—"}</span>
          </li>
          <li className="flex items-center gap-2">
            <Icon
              name="calendarAlt"
              size={20}
              className="shrink-0 text-neutral-default"
            />
            <span>{mission.day || "—"}</span>
          </li>
          <li className="flex items-center gap-2">
            <Icon
              name="timeFive"
              size={20}
              className="shrink-0 text-neutral-default"
            />
            <span>{mission.time || "—"}</span>
          </li>
        </ul>
      </div>
    </Link>
  );
}
