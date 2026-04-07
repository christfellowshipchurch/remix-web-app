import Icon from "~/primitives/icon";
import { useEffect, useState, useRef } from "react";
import { Video } from "~/primitives/video/video.primitive";
import { cn, isValidZip } from "~/lib/utils";

type SetCoordinatesProp = (
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null,
  options?: { scrollWithNavbarOffset?: boolean },
) => void;

type SearchProps = {
  handleSearch: (query: string | null) => void;
  setCoordinates: SetCoordinatesProp;
  /** When false: static hero image only (no video), search UI disabled until InstantSearch is idle. */
  instantSearchReady?: boolean;
};

const LOCATIONS_FINDER_HERO_BG = "/assets/images/locations/finder-hero-bg.webp";

export const Search = ({
  handleSearch,
  setCoordinates,
  instantSearchReady = true,
}: SearchProps) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [locationActive, setLocationActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroVideoFrameLoaded, setHeroVideoFrameLoaded] = useState(false);
  const heroVideoMountRef = useRef<HTMLDivElement>(null);
  const geolocationFromUserClickRef = useRef(false);

  useEffect(() => {
    if (!instantSearchReady) return;

    const root = heroVideoMountRef.current;
    if (!root) return;

    const iframe = root.querySelector("iframe");
    if (!iframe) return;

    const onLoad = () => setHeroVideoFrameLoaded(true);
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [instantSearchReady]);

  // Set the coordinates to the user's current location
  useEffect(() => {
    if (!instantSearchReady) return;

    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const scrollWithNavbarOffset = geolocationFromUserClickRef.current;
          geolocationFromUserClickRef.current = false;
          setCoordinates(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            { scrollWithNavbarOffset },
          );
          setLocationActive(true);
        },
        (error) => {
          geolocationFromUserClickRef.current = false;
          console.error(error);
          setLocationActive(false);
        },
      );

      setUseCurrentLocation(false);
    }
  }, [useCurrentLocation, setCoordinates, instantSearchReady]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center md:h-[78vh]">
      <div className="relative flex size-full overflow-hidden text-pretty">
        <div
          ref={heroVideoMountRef}
          className="pointer-events-none absolute inset-0 z-0 size-full overflow-hidden"
        >
          {!instantSearchReady || !heroVideoFrameLoaded ? (
            <img
              src={LOCATIONS_FINDER_HERO_BG}
              alt=""
              className="pointer-events-none absolute inset-0 z-0 size-full object-cover"
              draggable={false}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          ) : null}
          {instantSearchReady ? (
            <Video
              wistiaId="padj4c4xoh"
              autoPlay
              loop
              muted
              className="absolute inset-0 z-0 size-full object-cover"
            />
          ) : null}
        </div>
        <div className="absolute inset-0 z-10 size-full bg-[rgba(0,0,0,0.5)]" />
        <div className="absolute left-1/2 top-1/2 z-20 flex w-full max-w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 md:gap-6 rounded-xl md:bg-black/45 py-12 text-center text-white md:backdrop-blur lg:max-w-[900px]">
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
            disabled={!instantSearchReady}
          />

          {error && <div className="text-lg italic text-alert">{error}</div>}

          <div
            className={cn(
              "flex flex-col items-center gap-2",
              !instantSearchReady && "pointer-events-none opacity-50",
            )}
          >
            <div className="flex gap-2">
              <div
                className="cursor-pointer italic underline"
                onClick={() => {
                  geolocationFromUserClickRef.current = true;
                  setUseCurrentLocation(true);
                }}
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
  disabled = false,
}: {
  onSearchSubmit: (query: string | null) => void;
  setCoordinates: SetCoordinatesProp;
  setError: (error: string | null) => void;
  disabled?: boolean;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [zipCode, setZipCode] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

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

    // Close mobile keyboard by blurring the input
    inputRef.current?.blur();
  };

  // When the zip code is set, search for it
  useEffect(() => {
    if (disabled || !zipCode) return;
    onSearchSubmit(zipCode);
  }, [zipCode, disabled, onSearchSubmit]);

  return (
    <form
      data-gtm="hero-cta"
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full md:max-w-[360px] items-center gap-2 rounded-full p-1 mt-2 md:mt-0",
        inputValue ? "bg-gray" : "bg-white",
        disabled && "opacity-80",
      )}
    >
      <button
        type="submit"
        disabled={disabled}
        className={cn(
          "flex items-center justify-center p-2 bg-ocean lg:bg-dark-navy rounded-full relative transition-colors duration-300",
          disabled
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer lg:hover:bg-ocean",
        )}
        aria-label="Search"
      >
        <Icon
          name="search"
          size={20}
          className={`text-white relative right-px bottom-px`}
        />
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by zip code"
        disabled={disabled}
        readOnly={disabled}
        aria-busy={disabled}
        className="grow w-full justify-center text-black px-3 outline-none appearance-none bg-transparent disabled:cursor-not-allowed"
        onBlur={() => inputRef.current?.blur()}
        ref={inputRef}
      />
    </form>
  );
};
