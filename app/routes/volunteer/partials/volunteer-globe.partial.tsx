import { SectionTitle } from "~/components/section-title";
import { GlobalMap } from "../components/global-map.component";
import { useLoaderData } from "react-router";
import { Trip } from "../types";
import { MissionTripCard } from "../components/cards/mission-trip-card.component";

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
