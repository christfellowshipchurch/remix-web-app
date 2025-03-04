import type { LoaderFunctionArgs } from "react-router";
import type { PodcastType, PodcastsLoaderData } from "../types";

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data for now, until we configure Rock for new podcasts structure
  const podcasts: PodcastType[] = [
    {
      id: "so-good-sisterhood",
      title: "So Good Sisterhood",
      image: "https://picsum.photos/seed/so-good-sisterhood/800/450",
      tags: ["Sisters", "Relationships"],
      href: "/podcasts/so-good-sisterhood",
    },
    {
      id: "young-and-adulting",
      title: "Young and Adulting",
      image: "https://picsum.photos/seed/young-and-adulting/800/450",
      tags: ["Tag example", "Tag example"],
      href: "/podcasts/young-and-adulting",
    },
    {
      id: "crew-cast",
      title: "Crew Cast",
      image: "https://picsum.photos/seed/crew-cast/800/450",
      tags: ["Men", "Leadership"],
      href: "/podcasts/crew-cast",
    },
    {
      id: "nexus",
      title: "Nexus",
      image: "https://picsum.photos/seed/nexus/800/450",
      tags: ["Leadership"],
      href: "/podcasts/nexus",
    },
    {
      id: "art-of-spousing",
      title: "Art of Spousing",
      image: "https://picsum.photos/seed/art-of-spousing/800/450",
      tags: ["Tag example", "Tag example"],
      href: "/podcasts/art-of-spousing",
    },
  ];

  const data: PodcastsLoaderData = {
    podcasts,
  };

  return Response.json(data);
}
