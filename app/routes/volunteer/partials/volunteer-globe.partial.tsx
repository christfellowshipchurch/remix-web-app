import { SectionTitle } from "~/components/section-title";
import { GlobalMap } from "../components/global-map.component";
import { useLoaderData } from "react-router";
import { Trip } from "../types";

export const mockTrips: Trip[] = [
  {
    id: 1,
    title: "Kenya Mission Trip",
    description: "Description of Kenya Mission Trip",
    coverImage: "https://via.placeholder.com/150",
    missionTripUrl: "https://www.google.com",
    coordinates: {
      lat: 0.47299392908066884,
      lng: 37.794231928340615,
    },
  },
  {
    id: 2,
    title: "Mexico City Outreach",
    description: "Description of Mexico City Outreach",
    coverImage: "https://via.placeholder.com/150",
    missionTripUrl: "https://www.google.com",
    coordinates: {
      lat: 19.435073929447306,
      lng: -99.12447330791348,
    },
  },
  {
    id: 3,
    title: "Philippines Ministry",
    description: "Description of Philippines Ministry",
    coverImage: "https://via.placeholder.com/150",
    missionTripUrl: "https://www.google.com",
    coordinates: {
      lat: 12.46565145638497,
      lng: 123.28325302367281,
    },
  },
  {
    id: 4,
    title: "Brazil Church Plant",
    description: "Description of Brazil Church Plant",
    coverImage: "https://via.placeholder.com/150",
    missionTripUrl: "https://www.google.com",
    coordinates: {
      lat: -8.267809210739987,
      lng: -52.825281870367135,
    },
  },
  {
    id: 5,
    title: "Portugal Outreach",
    description: "Description of Portugal Outreach",
    coverImage: "https://via.placeholder.com/150",
    missionTripUrl: "https://www.google.com",
    coordinates: {
      lat: 39.69847926174241,
      lng: -8.892924777004827,
    },
  },
  {
    id: 6,
    title: "Japan Ministry",
    description: "Description of Japan Ministry",
    coverImage: "https://via.placeholder.com/150",
    missionTripUrl: "https://www.google.com",
    coordinates: {
      lat: 36.97596204921657,
      lng: 140.9166433174996,
    },
  },
];

export function VolunteerGlobe() {
  const { missionTrips } = useLoaderData();

  return (
    <section id="globe" className="w-full bg-white py-28">
      <div className="max-w-screen-content mx-auto">
        <SectionTitle sectionTitle="missions" />
        <h2 className="heading-h2 my-8">Volunteer Around The Globe</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* TODO: Replace with real cards */}
          <div className="flex-1 flex flex-col gap-4">
            {missionTrips.map((trip: Trip) => (
              <div
                key={trip.id}
                className="bg-white border rounded-lg shadow p-6 flex items-center gap-4"
              >
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="w-[150px]"
                />
                <h3 className="heading-h3">{trip.title}</h3>
              </div>
            ))}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <GlobalMap trips={missionTrips} />
          </div>
        </div>
      </div>
    </section>
  );
}
