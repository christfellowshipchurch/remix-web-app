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

const getContentChannelUrl = (key: keyof typeof ContentChannelIds): string => {
  const value = ContentChannelIds[key];
  const basePath =
    key === "studies"
      ? "studies"
      : key
          .toLowerCase()
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .toLowerCase();
  return `/${basePath}`;
};
