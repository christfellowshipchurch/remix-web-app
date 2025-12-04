import { useFetcher } from "react-router-dom";
import { cn, isValidZip } from "~/lib/utils";
import { useEffect, useState } from "react";
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

  // Handle zip code geocoding
  useEffect(() => {
    if (inputValue.length === 5 && isValidZip(inputValue)) {
      setIsGeocoding(true);
      const formData = new FormData();
      formData.append("address", inputValue);
      geocodeFetcher.submit(formData, {
        method: "post",
        action: "/google-geocode",
      });
    } else {
      setCoordinates(null);
    }
  }, [inputValue, setCoordinates]);

  // Handle geocoding response
  useEffect(() => {
    if (geocodeFetcher.data?.results?.[0]?.geometry?.location) {
      const { lat, lng } = geocodeFetcher.data.results[0].geometry.location;
      setCoordinates({ lat, lng });
    }
    if (geocodeFetcher.data) {
      setIsGeocoding(false);
    }
  }, [geocodeFetcher.data, setCoordinates]);

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
