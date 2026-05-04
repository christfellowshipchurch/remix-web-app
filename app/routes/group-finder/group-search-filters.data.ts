import type { SearchFilterDesktopItem } from "~/components/finders/search-filters";
import type { FilterPopupData } from "~/components/finders/search-filters/filter-popup.component";

/** Desktop popover + mobile overflow sheet title (pill label remains “More”). */
export const GROUP_FINDER_MORE_POPUP_TITLE = "More Filters";

type Coordinates = {
  lat: number | null;
  lng: number | null;
} | null;

export type GroupSearchDesktopFilterOpts = {
  coordinates: Coordinates;
  setCoordinates: (coordinates: Coordinates) => void;
  locationSource: "zip" | "gps" | null;
  onLocationKind: (kind: "zip" | "gps" | null) => void;
};

/** Desktop / compact filter definitions (same sections as legacy `DesktopGroupFilters`). */
export function getGroupSearchDesktopFilters(
  opts: GroupSearchDesktopFilterOpts,
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
            attribute: "meetingType",
            isMeetingType: true,
          },
          {
            title: "Christ Fellowship Campus",
            attribute: "campusName",
            isDropdown: true,
          },
          {
            title: "Filter by zip code",
            attribute: "campusName",
            isLocation: true,
            coordinates: opts.coordinates,
            setCoordinates: opts.setCoordinates,
            locationSource: opts.locationSource,
            onLocationKind: opts.onLocationKind,
          },
          {
            title: "Filter by distance",
            attribute: "campusName",
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
            inputPlaceholder: "Enter your Age",
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
            attribute: "meetingDay",
            isWeekdays: true,
          },
          {
            title: "Meeting Frequency",
            attribute: "meetingFrequency",
          },
          {
            title: "Child Care",
            attribute: "adultsOnly",
            checkboxLayout: "horizontal",
            checkbox: true,
          },
          { title: "Language", attribute: "language" },
        ],
      },
    },
  ];
}

/** Narrow mobile / tablet “More” overflow: topic bands + meeting days, frequency, child care, language. */
export function getGroupFinderMoreOverflowFilterData(
  opts: GroupSearchDesktopFilterOpts,
): FilterPopupData {
  const desktop = getGroupSearchDesktopFilters(opts);
  const topics = desktop.find((f) => f.id === "topics")!.data;
  const more = desktop.find((f) => f.id === "more")!.data;
  return {
    showFooter: false,
    content: [...topics.content, ...more.content],
  };
}

/** Tablet/desktop full “all filters” card: location (incl. campus dropdown), people, topics, more. */
export function getGroupFinderTabletFiltersPanelData(
  opts: GroupSearchDesktopFilterOpts,
): FilterPopupData {
  const desktop = getGroupSearchDesktopFilters(opts);
  const location = desktop.find((f) => f.id === "location")!.data.content;
  const people = desktop.find((f) => f.id === "people")!.data.content;
  const tail = getGroupFinderMoreOverflowFilterData(opts).content;
  return {
    showFooter: false,
    content: [...location, ...people, ...tail],
  };
}
