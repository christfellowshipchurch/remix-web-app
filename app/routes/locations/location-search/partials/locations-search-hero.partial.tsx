import Icon from "~/primitives/icon";
import { useEffect, useState } from "react";
import { Video } from "~/primitives/video/video.primitive";
import { cn, isValidZip } from "~/lib/utils";
import { SearchBox, useSearchBox } from "react-instantsearch";

type SearchProps = {
  handleSearch: (query: string | null) => void;
  setCoordinates: (coordinates: {
    lat: number | null;
    lng: number | null;
  }) => void;
};

export const Search = ({ handleSearch, setCoordinates }: SearchProps) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationActive, setLocationActive] = useState(true);

  // Set the coordinates to the user's current location
  useEffect(() => {
    if (useCurrentLocation) {
      // Get the current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationActive(true);
        },
        (error) => {
          console.error(error);
          setLocationActive(false);
        }
      );

      setUseCurrentLocation(false);
    }
  }, [useCurrentLocation]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center md:h-[78vh]">
      <div className="relative flex size-full overflow-hidden text-pretty">
        <Video
          wistiaId="padj4c4xoh"
          autoPlay
          loop
          muted
          className="absolute left-0 top-0 size-full object-cover"
        />
        <div className="absolute size-full bg-[rgba(0,0,0,0.5)]" />
        <div className="absolute left-1/2 top-1/2 flex w-full max-w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 md:gap-6 rounded-xl md:bg-black/45 py-12 text-center text-white md:backdrop-blur lg:max-w-[900px]">
          <h1 className="text-3xl leading-tight md:text-[36px] font-bold">
            Christ Fellowship Church Locations
          </h1>
          <p className="max-w-[90vw] md:text-xl md:max-w-[560px]">
            Christ Fellowship is one church with many locations across South
            Florida, and online—wherever you are!
          </p>

          <SearchBar
            onSearchSubmit={handleSearch}
            setCoordinates={setCoordinates}
            data-gtm="hero-cta"
          />

          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <div
                className="cursor-pointer italic underline"
                onClick={() => setUseCurrentLocation(true)}
              >
                Use my current location
              </div>
              <Icon size={16} color="white" name="locationArrow" />
            </div>
            {!locationActive && (
              <div className="text-sm italic text-alert">
                Enable Location Access & Try Again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({
  onSearchSubmit,
  setCoordinates,
}: {
  onSearchSubmit: (query: string | null) => void;
  setCoordinates: (coordinates: {
    lat: number | null;
    lng: number | null;
  }) => void;
}) => {
  const { query, refine } = useSearchBox();
  const [zipCode, setZipCode] = useState<string | null>(null);

  useEffect(() => {
    if (query.length === 5 && isValidZip(query)) {
      setZipCode(query);
    } else if (query.length !== 0) {
      // Clear the coordinates if the query is not a zip code but a location name
      setCoordinates({ lat: null, lng: null });
    }
  }, [query]);

  // When the zip code is set, search for it and clear the query so the query doesn't interfere with the geo search
  useEffect(() => {
    if (zipCode) {
      onSearchSubmit(zipCode);
      refine("");
    }
  }, [zipCode]);

  return (
    <div
      className={cn(
        "flex w-full md:max-w-[500px] items-center gap-4 rounded-full p-1 mt-2 md:mt-0",
        query ? "bg-gray" : "bg-white"
      )}
    >
      <button
        type="submit"
        className="flex items-center justify-center p-2 bg-ocean lg:bg-dark-navy rounded-full relative"
      >
        <Icon
          name="search"
          size={20}
          className={`text-white relative right-[1px] bottom-[1px]`}
        />
      </button>

      <SearchBox
        placeholder="Search by zip code"
        classNames={{
          root: "flex-grow w-full",
          form: "flex",
          input: `w-full justify-center text-black px-3 outline-none appearance-none`,
          reset: "hidden",
          loadingIndicator: "hidden",
          resetIcon: "hidden",
          submit: "hidden",
        }}
      />
    </div>
  );
};
