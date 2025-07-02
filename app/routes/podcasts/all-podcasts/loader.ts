import type { Podcast } from "../types";

export type PodcastsHubLoaderData = {
  podcasts: Podcast[];
};

export async function loader() {
  // Mock data for now, until we configure Rock for new podcasts structure
  const podcasts: Podcast[] = [
    {
      title: "So Good Sisterhood",
      trailer: "/assets/videos/podcasts/sisterhood.mp4",
      coverImage: "/assets/images/podcasts/sisterhood.jpg",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      seasons: [],
      shareLinks: [
        {
          title: "Apple Music",
          url: "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
        },
        {
          title: "Spotify",
          url: "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
        },
        {
          title: "Amazon Music",
          url: "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
        },
      ],
      tags: ["Sisters", "Relationships"],
    },
    {
      title: "Young and Adulting",
      trailer: "/assets/videos/podcasts/young-adults.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      seasons: [],
      shareLinks: [],
      coverImage: "/assets/images/podcasts/young-adults.jpg",
      tags: ["Tag example", "Tag example"],
    },
    {
      title: "Crew Cast",
      trailer: "/assets/videos/podcasts/crew.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      seasons: [],
      shareLinks: [],
      coverImage: "/assets/images/podcasts/crew.jpg",
      tags: ["Men", "Leadership"],
    },
    {
      title: "Nexus",
      trailer: "/assets/videos/podcasts/nexus.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      seasons: [],
      shareLinks: [],
      coverImage: "/assets/images/podcasts/nexus.jpg",
      tags: ["Leadership"],
    },
    {
      title: "Art of Spousing",
      trailer: "/assets/videos/podcasts/marriage.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      seasons: [],
      shareLinks: [],
      coverImage: "/assets/images/podcasts/marriage.jpg",
      tags: ["Tag example", "Tag example"],
    },
  ];

  const data: PodcastsHubLoaderData = {
    podcasts,
  };

  return Response.json(data);
}
