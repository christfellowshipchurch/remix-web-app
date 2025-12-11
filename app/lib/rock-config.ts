export const ContentChannelIds = {
  articles: 43,
  default: 85,
  devotionals: 83,
  events: 78,
  locations: 88,
  messages: 63,
  studies: [79, 80],
  soGoodSisterhood: 95,
  keepTalking: 96,
};

export const getContentChannelUrl = (key: number): string => {
  const channelMap = Object.entries(ContentChannelIds).reduce(
    (acc, [path, id]) => {
      if (Array.isArray(id)) {
        id.forEach((num) => (acc[num] = `/${path.toLowerCase()}`));
      } else {
        acc[id] = `/${path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`;
      }
      return acc;
    },
    {} as Record<number, string>
  );

  return channelMap[key] || "/";
};

/**
 * Default Rock Campuses and types for campus related UI elements
 */
export const RockCampuses = [
  {
    name: "Palm Beach Gardens",
    link: "/palm-beach-gardens",
  },
  {
    name: "Port St. Lucie",
    link: "/port-st-lucie",
  },
  {
    name: "Royal Palm Beach",
    link: "/royal-palm-beach",
  },
  {
    name: "Boynton Beach",
    link: "/boynton-beach",
  },
  {
    name: "Downtown West Palm Beach",
    link: "/downtown-west-palm-beach",
  },
  {
    name: "Jupiter",
    link: "/jupiter",
  },
  {
    name: "Stuart",
    link: "/stuart",
  },
  {
    name: "Okeechobee",
    link: "/okeechobee",
  },
  {
    name: "Belle Glade",
    link: "/belle-glade",
  },
  {
    name: "Vero Beach",
    link: "/vero-beach",
  },
  {
    name: "Boca Raton",
    link: "/boca-raton",
  },
  {
    name: "Riviera Beach",
    link: "/riviera-beach",
  },
  {
    name: "Trinity",
    link: "/trinity",
  },
  {
    name: "Westlake",
    link: "/westlake",
  },
] as const;

export type RockCampus = (typeof RockCampuses)[number];
export type RockCampusName = RockCampus["name"];
export type RockCampusLink = RockCampus["link"];
