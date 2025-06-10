import { SectionTitle } from "~/components/section-title";
import { GlobalMap } from "../components/global-map.component";
import { useLoaderData } from "react-router";
import { Trip } from "../types";
import Icon from "~/primitives/icon";
import { cn } from "~/lib/utils";

function MissionTripCard({ trip }: { trip: Trip }) {
  return (
    <a
      href={trip.missionTripUrl}
      target="_blank"
      className={cn(
        "bg-[#F2F2F2]",
        "border border-neutral-lighter",
        "rounded shadow",
        "flex items-center gap-4",
        "min-w-[350px] sm:min-w-[420px]",
        "p-2",
        "group"
      )}
    >
      <img
        src={trip.coverImage}
        alt={trip.title}
        className="aspect-video max-w-[165px] rounded object-cover flex-shrink-0"
      />
      <div className="flex flex-col justify-between h-full w-full">
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
    </a>
  );
}

export function VolunteerGlobe() {
  const { missionTrips } = useLoaderData();

  return (
    <section id="globe" className="w-full bg-white py-28 content-padding">
      <div className="max-w-screen-content mx-auto">
        <SectionTitle sectionTitle="missions" />
        <div className="flex flex-col gap-4 my-12">
          <h2 className="heading-h2">Volunteer Around The Globe</h2>
          <p className="text-neutral-default">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </div>
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12">
          <div className="flex flex-col gap-4">
            {missionTrips.map((trip: Trip) => (
              <MissionTripCard key={trip.id} trip={trip} />
            ))}
          </div>
          <div className="flex items-center justify-center px-2 lg:px-0">
            <GlobalMap trips={missionTrips} />
          </div>
        </div>
      </div>
    </section>
  );
}
