import { useFetcher } from "react-router-dom";
import { cn, isValidZip } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";
import { getCurrentPositionFromUserGesture } from "~/lib/browser-geolocation";
import { Icon } from "~/primitives/icon/icon";

export type FinderLocationKind = "zip" | "gps" | null;

/** `text-base` below `md` avoids iOS Safari auto-zoom on focus (16px minimum). */
export const finderLocationInputBaseClass =
  "box-border min-h-11 min-w-0 rounded border border-[#909090] px-2 py-2 text-base leading-snug text-text-secondary placeholder:text-[#909090] [color-scheme:light] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#909090] transition-colors duration-300 disabled:opacity-50 md:text-sm";

export const finderApplyZipButtonClass =
  "inline-flex min-h-0 shrink-0 items-center justify-center gap-1 border-0 bg-ocean px-5 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-1";

const finderCurrentLocationButtonClass =
  "inline-flex min-h-0 min-w-0 items-center justify-center gap-2 border-0 bg-gray px-4 py-2 text-sm font-semibold text-text-primary transition-colors duration-300 hover:bg-neutral-200 disabled:opacity-50 rounded";

export const FinderLocationSearch = ({
  coordinates,
  setCoordinates,
  className,
  autoGeocodeZip = true,
  showZipInput = true,
  showCurrentLocationButton = true,
  onLocationKind,
}: {
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  setCoordinates: (
    coordinates: {
      lat: number | null;
      lng: number | null;
    } | null,
  ) => void;
  className?: string;
  /** When false, zip is geocoded only when the user clicks Apply (valid 5-digit zip). */
  autoGeocodeZip?: boolean;
  showZipInput?: boolean;
  showCurrentLocationButton?: boolean;
  /** Called when this control sets or clears map search coordinates (zip geocode, GPS, or clear). */
  onLocationKind?: (kind: FinderLocationKind) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGpsRequesting, setIsGpsRequesting] = useState(false);
  const geocodeFetcher = useFetcher();
  const lastSubmittedZipRef = useRef<string | null>(null);

  useEffect(() => {
    if (!showZipInput) return;

    if (autoGeocodeZip) {
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
        onLocationKind?.(null);
      } else {
        lastSubmittedZipRef.current = null;
      }
      return;
    }

    if (inputValue.length === 0) {
      lastSubmittedZipRef.current = null;
    }
  }, [
    autoGeocodeZip,
    showZipInput,
    inputValue,
    setCoordinates,
    geocodeFetcher.state,
    onLocationKind,
  ]);

  useEffect(() => {
    if (coordinates === null && showZipInput) {
      setInputValue("");
      lastSubmittedZipRef.current = null;
    }
  }, [coordinates, showZipInput]);

  useEffect(() => {
    if (geocodeFetcher.state === "idle" && geocodeFetcher.data) {
      const location = geocodeFetcher.data?.results?.[0]?.geometry?.location;
      if (
        location &&
        typeof location.lat === "number" &&
        typeof location.lng === "number"
      ) {
        setCoordinates({ lat: location.lat, lng: location.lng });
        onLocationKind?.("zip");
      }
      setIsGeocoding(false);
    }
  }, [
    geocodeFetcher.data,
    geocodeFetcher.state,
    setCoordinates,
    onLocationKind,
  ]);

  const submitZipGeocode = (zip: string) => {
    if (
      zip.length !== 5 ||
      !isValidZip(zip) ||
      geocodeFetcher.state !== "idle"
    ) {
      return;
    }
    lastSubmittedZipRef.current = zip;
    setIsGeocoding(true);
    const formData = new FormData();
    formData.append("address", zip);
    geocodeFetcher.submit(formData, {
      method: "post",
      action: "/google-geocode",
    });
  };

  const handleApplyZip = () => {
    if (inputValue.length === 5 && isValidZip(inputValue)) {
      submitZipGeocode(inputValue);
    } else {
      lastSubmittedZipRef.current = null;
      setCoordinates(null);
      onLocationKind?.(null);
    }
  };

  const handleCurrentLocationClick = () => {
    setIsGeocoding(false);
    if (showZipInput) {
      setInputValue("");
      lastSubmittedZipRef.current = null;
    }

    setIsGpsRequesting(true);
    getCurrentPositionFromUserGesture(
      (position) => {
        setIsGpsRequesting(false);
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        onLocationKind?.("gps");
      },
      (error) => {
        setIsGpsRequesting(false);
        console.error("Error getting current location:", error);
      },
    );
  };

  const showZipRow = showZipInput;
  const showGpsRow = showCurrentLocationButton;

  if (!showZipRow && !showGpsRow) {
    return null;
  }

  const manualZipApply = showZipRow && !autoGeocodeZip;

  const currentLocationButton = (
    <button
      type="button"
      className={finderCurrentLocationButtonClass}
      disabled={isGeocoding || isGpsRequesting}
      onClick={handleCurrentLocationClick}
    >
      <Icon
        name="targetBlank"
        size={16}
        className="shrink-0 text-text-primary"
      />
      <span>Share Your Location</span>
    </button>
  );

  return (
    <div
      className={cn("flex w-full flex-col gap-2", className)}
      onClick={(e) => e.stopPropagation()}
    >
      {manualZipApply ? (
        <div className="flex w-full min-w-0 flex-row items-stretch gap-2">
          <input
            type="text"
            placeholder="Enter ZIP"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={cn(finderLocationInputBaseClass, "min-w-0 flex-1")}
            disabled={isGeocoding || isGpsRequesting}
          />
          <button
            type="button"
            className={finderApplyZipButtonClass}
            disabled={isGeocoding || isGpsRequesting}
            onClick={handleApplyZip}
          >
            Apply
          </button>
        </div>
      ) : null}

      {showZipRow && autoGeocodeZip ? (
        <div className="flex w-full flex-wrap items-stretch gap-2">
          <input
            type="text"
            placeholder="Enter ZIP"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={cn(
              finderLocationInputBaseClass,
              showGpsRow ? "min-w-0 flex-1" : "w-full",
            )}
            disabled={isGeocoding || isGpsRequesting}
          />
          {showGpsRow ? currentLocationButton : null}
        </div>
      ) : null}

      {manualZipApply && showGpsRow ? (
        <div className="flex w-full flex-wrap gap-2">
          {currentLocationButton}
        </div>
      ) : null}

      {!showZipRow && showGpsRow ? (
        <div className="flex w-full flex-wrap gap-2">
          {currentLocationButton}
        </div>
      ) : null}
    </div>
  );
};
