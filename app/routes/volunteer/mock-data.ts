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

export const mockRegionData: RegionCard[] = [
  {
    title: "Region 1",
    image: "https://picsum.photos/seed/region1/800/600",
    spotsLeft: 10,
    description:
      "Join us in making a difference in our local community through this impactful volunteer opportunity. We're looking for dedicated individuals who are passionate about serving others and creating positive change. This role involves working directly with community members, organizing resources, and collaborating with our experienced team. You'll gain valuable experience while helping those in need. Whether you're new to volunteering or have years of experience, your contribution will be valued and meaningful. Together, we can build stronger, more connected communities and touch lives in profound ways.",
    location: "Downtown Campus",
    date: "Fri 09 Feb 2024",
    time: "4:00PM - 6:30PM",
    href: "#",
  },
  {
    title: "Region 2",
    image: "https://picsum.photos/seed/region2/800/600",
    spotsLeft: 8,
    description: "Description 2",
    location: "North Campus",
    date: "Fri 16 Feb 2024",
    time: "4:00PM - 6:30PM",
    href: "#",
  },
  {
    title: "Region 3",
    image: "https://picsum.photos/seed/region3/800/600",
    spotsLeft: 5,
    description: "Description 3",
    location: "South Campus",
    date: "Fri 23 Feb 2024",
    time: "4:00PM - 6:30PM",
    href: "#",
  },
  {
    title: "Region 4",
    image: "https://picsum.photos/seed/region4/800/600",
    spotsLeft: 3,
    description: "Description 4",
    location: "West Campus",
    date: "Fri 01 Mar 2024",
    time: "4:00PM - 6:30PM",
    href: "#",
  },
];

export const mockVolunteerFeaturedEvent: VolunteerFeaturedEvent = {
  title: "Dream Team Kickoff?",
  subtitle: "Featured Event",
  description: `We have many opportunities for you to volunteer from wherever you are—whether it's at your local campus, online with Christ Fellowship Everywhere, or with one of our central ministries out of the Palm Beach Gardens location. Find your spot on the Dream Team today.`,
  url: "#todo",
  imageUrl: "/assets/images/volunteer/dream-team-kickoff.webp",
};
