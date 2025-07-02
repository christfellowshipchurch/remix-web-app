import { SectionTitle } from "~/components/section-title";
import { GlobalMap } from "../components/global-map.component";
import { useLoaderData } from "react-router-dom";
import { Trip } from "../types";
import { MissionTripCard } from "../components/cards/mission-trip-card.component";

export function VolunteerGlobe() {
  const { missionTrips } = useLoaderData();

  // Create an array of the first trip from each country
  const topTrips: Trip[] = Object.values(missionTrips as Record<string, Trip[]>)
    .map((trips) => trips[0])
    .filter(Boolean);

  // We only want to show the "NEW" badge if there is at least one trip with an apply url
  const isNew = (trip: Trip) => {
    const tripCountry = trip.country;
    const tripsFromThatCountry = missionTrips[tripCountry] || [];

    const tripsWithApplyUrl = tripsFromThatCountry.filter(
      (t: Trip) => t.applyUrl !== ""
    );

    return tripsWithApplyUrl.length !== 0;
  };

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
            {topTrips.map((trip) => (
              <MissionTripCard key={trip.id} trip={trip} isNew={isNew(trip)} />
            ))}
          </div>
          <div className="flex items-center justify-center px-2 lg:px-0">
            <GlobalMap trips={topTrips} />
          </div>
        </div>
      </div>
    </section>
  );
}
