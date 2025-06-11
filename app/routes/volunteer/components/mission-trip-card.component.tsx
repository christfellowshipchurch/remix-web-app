import { MissionsModal } from "~/components/modals";
import { Trip } from "../types";
import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";

export function MissionTripCard({ trip }: { trip: Trip }) {
  return (
    <MissionsModal
      trigger={
        <div
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
            "transition-all duration-300"
          )}
        >
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="aspect-video max-w-[165px] rounded object-cover flex-shrink-0"
          />
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col">
              <span className="text-xs uppercase text-secondary font-semibold tracking-wider">
                New
              </span>
              <h3 className="font-bold text-lg text-primary group-hover:text-ocean transition-colors">
                {trip.title}
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-default group-hover:text-ocean transition-colors">
                Explore now
              </span>
              <Icon
                name="arrowRight"
                className="text-neutral-default group-hover:text-ocean transition-colors"
              />
            </div>
          </div>
        </div>
      }
      trip={{
        ...trip,
      }}
    />
  );
}
