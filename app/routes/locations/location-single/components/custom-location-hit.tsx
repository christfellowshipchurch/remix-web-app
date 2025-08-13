import { useHits, useInstantSearch } from "react-instantsearch";
import { LocationHitType } from "../types";
import { LocationSingle } from "../partials/location-content";
import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";

export const LocationPageHit = () => {
  const { allCampuses, campusUrl } = useLoaderData<LoaderReturnType>();
  const { items } = useHits<LocationHitType>();

  // Check if the current campus URL is in the list of valid campuses
  if (!allCampuses.includes(campusUrl)) {
    throw new Error("Location Not Found");
  }

  return (
    <div className="w-full">
      {items.map((hit, index) => (
        <LocationSingle key={index} hit={hit as LocationHitType} />
      ))}
    </div>
  );
};
