import type { SearchFilterDesktopItem } from "~/components/finders/search-filters";

/** Desktop popover + mobile overflow sheet title (pill label remains “More”). */
export const GROUP_FINDER_MORE_POPUP_TITLE = "More Filters";

type Coordinates = {
  lat: number | null;
  lng: number | null;
} | null;

/** Desktop / compact filter definitions (same sections as legacy `DesktopGroupFilters`). */
export function getGroupSearchDesktopFilters(opts: {
  coordinates: Coordinates;
  setCoordinates: (coordinates: Coordinates) => void;
  locationSource: "zip" | "gps" | null;
  onLocationKind: (kind: "zip" | "gps" | null) => void;
}): SearchFilterDesktopItem[] {
  return [
    {
      id: "location",
      label: "Location",
      popupTitle: "Location",
      icon: "map",
      data: {
        content: [
          {
            title: "I want to meet...",
            attribute: "meetingType",
            isMeetingType: true,
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
      id: "people",
      label: "People",
      popupTitle: "People",
      icon: "user",
      data: {
        showFooter: true,
        content: [
          {
            title: "I want to join a group for...",
            attribute: "groupFor",
          },
          {
            title: "I want to meet people who are...",
            attribute: "peopleWhoAre",
          },
          {
            title: "Age Range",
            attribute: "minAge",
            input: true,
            inputPlaceholder: "Your Age",
            isAgeRange: true,
          },
        ],
      },
    },
    {
      id: "topics",
      label: "Topics",
      popupTitle: "Topics",
      icon: "bookOpen",
      data: {
        showFooter: true,
        content: [
          { title: "Spiritual Growth", attribute: "topics" },
          { title: "Life & Support", attribute: "topics" },
          { title: "Community & Fun", attribute: "topics" },
        ],
      },
    },
    {
      id: "more",
      label: "More",
      popupTitle: GROUP_FINDER_MORE_POPUP_TITLE,
      icon: "sliderAlt",
      data: {
        showFooter: true,
        content: [
          {
            title: "Meeting Days",
            attribute: "meetingDays",
            isWeekdays: true,
          },
          {
            title: "Meeting Frequency",
            attribute: "meetingFrequency",
          },
          {
            title: "Child Care",
            attribute: "adultOnly",
            checkboxLayout: "horizontal",
            checkbox: true,
          },
          { title: "Language", attribute: "language" },
        ],
      },
    },
  ];
}
