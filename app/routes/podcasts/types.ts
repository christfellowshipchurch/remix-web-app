export type PodcastType = {
  id: string;
  title: string;
  image: string;
  tags: string[];
  href: string;
};

export type PodcastsLoaderData = {
  podcasts: PodcastType[];
};
