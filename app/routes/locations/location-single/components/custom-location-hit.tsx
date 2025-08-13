import { useHits, useInstantSearch } from "react-instantsearch";
import { LocationHitType } from "../types";
import { LocationSingle } from "../partials/location-content";
import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";

export const LocationPageHit = () => {
  const { items } = useHits<LocationHitType>();

  return (
    <div className="w-full">
      {items.map((hit, index) => (
        <LocationSingle key={index} hit={hit as LocationHitType} />
      ))}
    </div>
  );
};
