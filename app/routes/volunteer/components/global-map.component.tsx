type Trip = {
  id: number;
  title: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const mockTrips: Trip[] = [
  {
    id: 1,
    title: "Kenya Mission Trip",
    coordinates: {
      lat: 0.47299392908066884,
      lng: 37.794231928340615,
    },
  },
  {
    id: 2,
    title: "Mexico City Outreach",
    coordinates: {
      lat: 19.435073929447306,
      lng: -99.12447330791348,
    },
  },
  {
    id: 3,
    title: "Philippines Ministry",
    coordinates: {
      lat: 12.46565145638497,
      lng: 123.28325302367281,
    },
  },
  {
    id: 4,
    title: "Brazil Church Plant",
    coordinates: {
      lat: -8.267809210739987,
      lng: -52.825281870367135,
    },
  },
  {
    id: 5,
    title: "Portugal Outreach",
    coordinates: {
      lat: 39.69847926174241,
      lng: -8.892924777004827,
    },
  },
  {
    id: 6,
    title: "Japan Ministry",
    coordinates: {
      lat: 36.97596204921657,
      lng: 140.9166433174996,
    },
  },
];

import { useMapDimensions } from "./useMapDimensions";

export function GlobalMap({ trips = mockTrips }: { trips?: Trip[] }) {
  const { ref, dimensions, offset } = useMapDimensions();

  const projectToMap = (lat: number, lng: number) => {
    const { width, height } = dimensions;

    const x = (lng + 180) * (width / 360);
    const clampedLat = Math.max(Math.min(lat, 85), -85);
    const latRad = clampedLat * (Math.PI / 180);
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = height / 2 - (width * mercN) / (2 * Math.PI);

    return {
      x: x - offset,
      y,
    };
  };

  return (
    <div className="relative w-full max-w-[1030px] mx-auto">
      <img
        ref={ref}
        src="/assets/images/volunteer/map.png"
        alt="World map"
        className="w-full h-auto"
      />

      {trips.map((trip) => {
        const { x, y } = projectToMap(
          trip.coordinates.lat,
          trip.coordinates.lng
        );
        return (
          <div
            key={trip.id}
            className="absolute w-3 h-3 bg-sky-400 rounded-full"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
            }}
            title={trip.title}
          />
        );
      })}
    </div>
  );
}
