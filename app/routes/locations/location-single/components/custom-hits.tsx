import { useHits } from "react-instantsearch";
import { LocationHitType } from "../types";
import { LocationSingle } from "../partials/location-content";

export const LocationHit = () => {
  const { items } = useHits<LocationHitType>();
  if (items.length === 0) {
    throw new Error("Location Not Found");
  }

  return (
    <div className="w-full">
      {items.map((hit) => (
        <LocationSingle key={hit.objectID} hit={hit as LocationHitType} />
      ))}
    </div>
  );
};
