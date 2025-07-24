import type { LoaderFunctionArgs } from "react-router-dom";
import type { Podcast } from "../types";

export type PodcastsHubLoaderData = {
  podcasts: Podcast[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data for now, until we configure Rock for new podcasts structure
  const podcasts: Podcast[] = [
    {
      title: "So Good Sisterhood",
      // trailer: "/assets/videos/podcasts/sisterhood.mp4",
      coverImage: "/assets/images/podcasts/sisterhood.jpg",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      // seasons: [],
      apple:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      spotify:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      amazon:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      episodesChannelGuid: "sisterhood-guid",
    },
    {
      title: "Young and Adulting",
      // trailer: "/assets/videos/podcasts/young-adults.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      // seasons: [],
      apple:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      spotify:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      amazon:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      coverImage: "/assets/images/podcasts/young-adults.jpg",
      episodesChannelGuid: "young-adults-guid",
    },
    {
      title: "Crew Cast",
      // trailer: "/assets/videos/podcasts/crew.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      // seasons: [],
      apple:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      spotify:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      amazon:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      coverImage: "/assets/images/podcasts/crew.jpg",
      episodesChannelGuid: "crew-cast-guid",
    },
    {
      title: "Nexus",
      // trailer: "/assets/videos/podcasts/nexus.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      // seasons: [],
      apple:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      spotify:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      amazon:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      coverImage: "/assets/images/podcasts/nexus.jpg",
      episodesChannelGuid: "nexus-guid",
    },
    {
      title: "Art of Spousing",
      // trailer: "/assets/videos/podcasts/marriage.mp4",
      description:
        "Hosts James and Lisa Duvall share truths and lessons learned from their 30 years of marriage and over a decade of teaching, coaching, and speaking on marriage.",
      // seasons: [],
      apple:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      spotify:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      amazon:
        "https://www.facebook.com/sharer/sharer.php?u=https://www.rock.org/podcasts/so-good-sisterhood",
      coverImage: "/assets/images/podcasts/marriage.jpg",
      episodesChannelGuid: "art-of-spousing-guid",
    },
  ];

  const data: PodcastsHubLoaderData = {
    podcasts,
  };

  return Response.json(data);
}
