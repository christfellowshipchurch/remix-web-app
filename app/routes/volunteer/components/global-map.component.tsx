import { useMapDimensions } from "~/hooks/use-map-dimensions";
import { Trip } from "../types";

export function GlobalMap({ trips }: { trips: Trip[] }) {
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

  console.log(trips);

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
            className="absolute w-3 h-3 bg-sky-400 rounded-full animate-pulse"
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
