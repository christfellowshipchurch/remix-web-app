import { Trip } from "../../types";
import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";

export function MissionTripCard({
  trip,
  className,
}: {
  trip: Trip;
  className?: string;
}) {
  return (
    <a
      href={trip.missionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "bg-white/12 backdrop-blur-sm",
        "border border-white/10",
        "rounded-xl overflow-hidden",
        "grid min-h-0 grid-cols-1",
        "max-md:grid-rows-[auto_1fr]",
        "md:grid-cols-[165px_1fr] md:items-stretch",
        "group",
        "cursor-pointer",
        "hover:bg-white/10",
        "transition-all duration-300",
        "pb-6 md:pb-0",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full min-h-0 min-w-0 overflow-hidden",
          "aspect-video",
          "md:h-full md:min-h-0 md:self-stretch",
        )}
      >
        <img
          src={trip.image}
          alt={trip.title}
          className={cn(
            "h-full w-full object-cover",
            "md:absolute md:inset-0 md:h-full md:w-full md:min-h-full",
          )}
        />
      </div>
      <div className="flex min-h-0 min-w-0 max-md:h-full flex-col gap-2 p-5">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-ocean-web text-xs font-bold tracking-wide uppercase">
            <Icon name="map" size={12} className="text-ocean-web shrink-0" />
            <span>{trip.country}</span>
          </div>
          {trip.tripDate && (
            <span className="text-neutral-lighter text-xs shrink-0 uppercase">
              {trip.tripDate}
            </span>
          )}
        </div>
        <h3 className="shrink-0 font-bold text-lg text-white leading-snug line-clamp-2">
          {trip.title}
        </h3>
        <div
          className={cn(
            "shrink-0 text-sm text-neutral-lighter",
            "line-clamp-2",
            // line-clamp only counts lines in one block; CMS <p> tags must flow inline
            // or text escapes and gets clipped by the card (overflow-hidden).
            "[&_p]:m-0",
            "[&_p]:inline",
            "[&_p+_p]:pl-1",
          )}
        >
          <HTMLRenderer html={trip.description} />
        </div>
        {/* Fills under the 2-line preview on mobile so equal-height slides don’t shrink text */}
        <div
          className="min-h-0 max-md:flex-1 max-md:basis-0 max-md:min-h-0 md:hidden"
          aria-hidden
        />
      </div>
    </a>
  );
}
