import { Trip } from "../../types";
import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";

export function MissionTripCard({ trip }: { trip: Trip }) {
  return (
    <a
      href={trip.missionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "bg-[#F2F2F2]",
        "border border-neutral-lighter",
        "rounded shadow",
        "flex items-center gap-4",
        "min-w-[350px] sm:min-w-[420px]",
        "p-2",
        "group",
        "cursor-pointer",
        "hover:shadow-lg",
        "transition-all duration-300",
      )}
    >
      <img
        src={trip.image}
        alt={trip.title}
        className="aspect-video max-w-[165px] rounded object-cover shrink-0"
      />
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg text-primary group-hover:text-ocean transition-colors">
            {trip.title}
          </h3>
          <div className="text-sm text-neutral-default">
            <HTMLRenderer html={trip.description} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-sm text-neutral-default group-hover:text-ocean transition-colors">
            <span className="font-semibold">{trip.country}</span>
            {trip.tripDate && <span>{trip.tripDate}</span>}
          </div>
          <Icon
            name="arrowRight"
            className="text-neutral-default group-hover:text-ocean transition-colors"
          />
        </div>
      </div>
    </a>
  );
}
