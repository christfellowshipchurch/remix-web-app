/**
 * Options recommended for mobile Safari: high accuracy, no stale cache, bounded wait.
 * Call {@link getCurrentPositionFromUserGesture} only from a direct user action (click/tap),
 * not from useEffect — iOS Safari may not show the permission prompt otherwise.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
 */
export const DEFAULT_GET_CURRENT_POSITION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
} as const;

/** Shape returned by `navigator.geolocation` error callback (and our synthetic errors). */
export type GeolocationErrorInfo = {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
};

function syntheticGeolocationError(
  code: number,
  message: string,
): GeolocationErrorInfo {
  return {
    code,
    message,
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  };
}

export function getGeolocationUserMessage(error: GeolocationErrorInfo): string {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location access was denied. Enable it in Settings and try again.";
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Your location could not be determined.";
  }
  if (error.code === error.TIMEOUT) {
    return "Finding your location timed out. Try again.";
  }
  return "Could not get your location.";
}

function scheduleAsync(fn: () => void): void {
  void Promise.resolve().then(fn);
}

/**
 * Wraps `navigator.geolocation.getCurrentPosition` with iOS-friendly options, try/catch for
 * synchronous throws, and a clear error path when the API is missing.
 */
export function getCurrentPositionFromUserGesture(
  onSuccess: (position: {
    coords: { latitude: number; longitude: number };
  }) => void,
  onError: (error: GeolocationErrorInfo) => void,
): void {
  if (typeof window === "undefined" || !navigator?.geolocation) {
    scheduleAsync(() =>
      onError(
        syntheticGeolocationError(
          2,
          "Geolocation is not supported in this browser.",
        ),
      ),
    );
    return;
  }

  try {
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (err) => onError(err as GeolocationErrorInfo),
      DEFAULT_GET_CURRENT_POSITION_OPTIONS,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    scheduleAsync(() => onError(syntheticGeolocationError(2, message)));
  }
}
