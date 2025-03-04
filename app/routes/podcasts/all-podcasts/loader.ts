import type { LoaderFunctionArgs } from "react-router";
import type { PodcastType, PodcastsLoaderData } from "../types";

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data for now, until we configure Rock for new podcasts structure
  const podcasts: PodcastType[] = [
    {
      id: "so-good-sisterhood",
      title: "So Good Sisterhood",
      image: "/assets/images/podcasts/sisterhood.jpg",
      tags: ["Sisters", "Relationships"],
      href: "/podcasts/so-good-sisterhood",
    },
    {
      id: "young-and-adulting",
      title: "Young and Adulting",
      image: "/assets/images/podcasts/young-adults.jpg",
      tags: ["Tag example", "Tag example"],
      href: "/podcasts/young-and-adulting",
    },
    {
      id: "crew-cast",
      title: "Crew Cast",
      image: "/assets/images/podcasts/crew.jpg",
      tags: ["Men", "Leadership"],
      href: "/podcasts/crew-cast",
    },
    {
      id: "nexus",
      title: "Nexus",
      image: "/assets/images/podcasts/nexus.jpg",
      tags: ["Leadership"],
      href: "/podcasts/nexus",
    },
    {
      id: "art-of-spousing",
      title: "Art of Spousing",
      image: "/assets/images/podcasts/marriage.jpg",
      tags: ["Tag example", "Tag example"],
      href: "/podcasts/art-of-spousing",
    },
  ];

  const data: PodcastsLoaderData = {
    podcasts,
  };

  return Response.json(data);
}
