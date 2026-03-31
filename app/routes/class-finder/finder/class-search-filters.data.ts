import type { SearchFilterDesktopItem } from "~/components/finders/search-filters";

export const CLASS_SEARCH_DESKTOP_FILTERS = [
  {
    id: "topic",
    label: "Topic",
    popupTitle: "Topic",
    icon: "bookOpen",
    data: {
      showFooter: true,
      content: [
        {
          title: "LEARN ABOUT",
          attribute: "topic",
        },
      ],
    },
  },
] satisfies SearchFilterDesktopItem[];
