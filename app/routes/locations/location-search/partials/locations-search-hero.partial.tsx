import Icon from "~/primitives/icon";
import { useEffect, useState } from "react";
import { Video } from "~/primitives/video/video.primitive";
import { cn, isValidZip } from "~/lib/utils";

type SearchProps = {
  scrollCampusesIntoView: () => void;
  handleSearch: (query: string | null) => void;
  setCoordinates: (coordinates: {
    lat: number | null;
    lng: number | null;
  }) => void;
};

export const Search = ({
  handleSearch,
  setCoordinates,
  scrollCampusesIntoView,
}: SearchProps) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [locationActive, setLocationActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          scrollCampusesIntoView();
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
            setError={setError}
            data-gtm="hero-cta"
          />

          {error && <div className="text-lg italic text-alert">{error}</div>}

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
  setError,
}: {
  onSearchSubmit: (query: string | null) => void;
  setCoordinates: (coordinates: {
    lat: number | null;
    lng: number | null;
  }) => void;
  setError: (error: string | null) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [zipCode, setZipCode] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchValue = inputValue.trim();

    if (searchValue.length === 5 && isValidZip(searchValue)) {
      setZipCode(searchValue);
      setError(null);
    } else if (searchValue.length > 0) {
      // For non-zip searches, clear coordinates and search
      setCoordinates({ lat: null, lng: null });
      setError("Please enter a valid zip code");
      onSearchSubmit(searchValue);
    }
  };

  // When the zip code is set, search for it
  useEffect(() => {
    if (zipCode) {
      onSearchSubmit(zipCode);
    }
  }, [zipCode]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full md:max-w-[360px] items-center gap-2 rounded-full p-1 mt-2 md:mt-0",
        inputValue ? "bg-gray" : "bg-white"
      )}
    >
      <button
        type="submit"
        className="flex items-center justify-center p-2 bg-ocean lg:bg-dark-navy lg:hover:bg-ocean transition-colors duration-300 rounded-full relative cursor-pointer"
      >
        <Icon
          name="search"
          size={20}
          className={`text-white relative right-[1px] bottom-[1px]`}
        />
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by zip code"
        className="flex-grow w-full justify-center text-black px-3 outline-none appearance-none bg-transparent"
      />
    </form>
  );
};
