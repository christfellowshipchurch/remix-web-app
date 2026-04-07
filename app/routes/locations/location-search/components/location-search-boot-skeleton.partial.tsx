import { LocationsLoader } from "./locations-search-skeleton.component";
import { Search } from "../partials/locations-search-hero.partial";

const noopSearch = () => {};
const noopSetCoordinates = () => {};

/**
 * Shown before `InstantSearch` mounts: same hero (image only, no video) + disabled zip,
 * and the location card skeleton grid.
 */
export function LocationSearchBootSkeleton() {
  return (
    <>
      <Search
        handleSearch={noopSearch}
        setCoordinates={noopSetCoordinates}
        instantSearchReady={false}
      />
      <div
        className="flex w-full flex-col items-center justify-center py-12 md:px-5 lg:px-2"
        id="campuses"
      >
        <LocationsLoader />
      </div>
    </>
  );
}
