import type { FinderGeoCoordinates } from "~/components/finders/finder-algolia.utils";
import type { SearchFilterDesktopItem } from "~/components/finders/search-filters";

export type ClassSingleUpcomingFilterOpts = {
  coordinates: FinderGeoCoordinates;
  setCoordinates: (next: FinderGeoCoordinates) => void;
  locationSource: "zip" | "gps" | null;
  onLocationKind: (kind: "zip" | "gps" | null) => void;
};

/** Location (meet format, campus, zip, current location) + language for class-single upcoming. */
export function getClassSingleUpcomingDesktopFilters(
  opts: ClassSingleUpcomingFilterOpts,
): SearchFilterDesktopItem[] {
  return [
    {
      id: "location",
      label: "Location",
      popupTitle: "Location",
      icon: "map",
      data: {
        showFooter: true,
        content: [
          {
            title: "I want to meet...",
            attribute: "format",
            isMeetingType: true,
          },
          {
            title: "Christ Fellowship Campus",
            attribute: "campus",
            isDropdown: true,
          },
          {
            title: "Filter by zip code",
            attribute: "campus",
            isLocation: true,
            coordinates: opts.coordinates,
            setCoordinates: opts.setCoordinates,
            locationSource: opts.locationSource,
            onLocationKind: opts.onLocationKind,
          },
          {
            title: "Filter by distance",
            attribute: "campus",
            isCurrentLocation: true,
            coordinates: opts.coordinates,
            setCoordinates: opts.setCoordinates,
            locationSource: opts.locationSource,
            onLocationKind: opts.onLocationKind,
          },
        ],
      },
    },
    {
      id: "language",
      label: "Language",
      popupTitle: "Language",
      data: {
        showFooter: true,
        content: [{ attribute: "language" }],
      },
    },
  ];
}
