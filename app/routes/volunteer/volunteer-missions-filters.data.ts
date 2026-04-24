import type { SearchFilterDesktopItem } from "~/components/finders/search-filters";

/** Cause + campus pills for mobile `SearchFilters` (bottom sheets) — same index attributes as desktop. */
export function getVolunteerMissionsMobileFilters(): SearchFilterDesktopItem[] {
  return [
    {
      id: "cause",
      label: "Cause",
      popupTitle: "Cause",
      icon: "heart",
      data: {
        showFooter: true,
        content: [
          {
            title: "I want to help with",
            attribute: "category",
            singleSelectRefinement: true,
          },
        ],
      },
    },
    {
      id: "location",
      label: "Location",
      popupTitle: "Location",
      icon: "map",
      data: {
        showFooter: true,
        content: [
          {
            title: "Christ Fellowship city",
            attribute: "campusList",
            isDropdown: true,
          },
        ],
      },
    },
  ];
}
