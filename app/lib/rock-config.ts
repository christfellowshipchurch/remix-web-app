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
