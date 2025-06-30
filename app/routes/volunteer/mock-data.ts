import { CommunityCard, RegionCard } from "./types";
import type { VolunteerFeaturedEvent } from "./types";

export const mockCommunityData: CommunityCard[] = [
  {
    title: "Christ Fellowship Prison Locations",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    ctas: [
      {
        label: "Sign Up",
        href: "#",
      },
      {
        label: "Learn More",
        href: "#",
      },
    ],
  },
  {
    title: "Special Needs",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    ctas: [
      {
        label: "Sign Up",
        href: "#",
      },
      {
        label: "Learn More",
        href: "#",
      },
    ],
  },
  {
    title: "Foster and Adoptive Care",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    ctas: [
      {
        label: "Sign Up",
        href: "#",
      },
      {
        label: "Learn More",
        href: "#",
      },
    ],
  },
];

export const mockVolunteerFeaturedEvent: VolunteerFeaturedEvent = {
  title: "Dream Team Kickoff?",
  subtitle: "Featured Event",
  description: `We have many opportunities for you to volunteer from wherever you are—whether it's at your local campus, online with Christ Fellowship Everywhere, or with one of our central ministries out of the Palm Beach Gardens location. Find your spot on the Dream Team today.`,
  url: "#todo",
  imageUrl: "/assets/images/volunteer/dream-team-kickoff.webp",
};
