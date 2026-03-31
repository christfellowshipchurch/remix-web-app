import { useFetcher } from "react-router-dom";
import { cn, isValidZip } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

export const FinderLocationSearch = ({
  coordinates,
  setCoordinates,
  className,
}: {
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  setCoordinates: (
    coordinates: {
      lat: number | null;
      lng: number | null;
    } | null
  ) => void;
  className?: string;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeFetcher = useFetcher();
  const lastSubmittedZipRef = useRef<string | null>(null);

  // Submit only when zip changes to a new valid 5 digits (avoid re-submitting after fetcher returns to idle).
  // Only clear coordinates when the user has typed something that's not a valid zip (not when empty),
  // so that clicking "Current Location" (which clears the input) doesn't wipe coordinates before getCurrentPosition runs.
  useEffect(() => {
    if (inputValue.length === 5 && isValidZip(inputValue)) {
      if (
        lastSubmittedZipRef.current !== inputValue &&
        geocodeFetcher.state === "idle"
      ) {
        lastSubmittedZipRef.current = inputValue;
        setIsGeocoding(true);
        const formData = new FormData();
        formData.append("address", inputValue);
        geocodeFetcher.submit(formData, {
          method: "post",
          action: "/google-geocode",
        });
      }
    } else if (inputValue.length > 0) {
      lastSubmittedZipRef.current = null;
      setCoordinates(null);
    } else {
      lastSubmittedZipRef.current = null;
    }
  }, [inputValue, setCoordinates, geocodeFetcher.state]);

  // Handle geocoding response
  useEffect(() => {
    if (geocodeFetcher.state === "idle" && geocodeFetcher.data) {
      const location = geocodeFetcher.data?.results?.[0]?.geometry?.location;
      if (
        location &&
        typeof location.lat === "number" &&
        typeof location.lng === "number"
      ) {
        setCoordinates({ lat: location.lat, lng: location.lng });
      }
      setIsGeocoding(false);
    }
  }, [geocodeFetcher.data, geocodeFetcher.state, setCoordinates]);

  const handleCurrentLocationClick = () => {
    if (!navigator.geolocation) return;

    setIsGeocoding(false);
    setInputValue("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting current location:", error),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  return (
    <div
      className={cn("flex flex-wrap gap-2 w-full", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        placeholder="Zip Code"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn(
          "w-full max-w-[120px] text-base px-2 focus:outline-none rounded-lg border border-[#AAAAAA] py-2 flex h-full",
          "transition-all duration-300",
          {
            "border-ocean": coordinates,
          }
        )}
        disabled={isGeocoding}
      />
      <Button
        onClick={handleCurrentLocationClick}
        intent="primary"
        className="min-w-0 min-h-0 pl-2 pr-3 py-[6px] text-sm font-semibold rounded-[5px] flex gap-1"
        disabled={isGeocoding}
      >
        <Icon name="currentLocation" size={16} />
        <p>Current Location</p>
      </Button>
    </div>
  );
};
