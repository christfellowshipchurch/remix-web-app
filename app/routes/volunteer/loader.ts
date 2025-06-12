import { LoaderFunctionArgs } from "react-router";
import { Trip } from "./types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

const fetchMissionTrips = async () => {
  const missionTrips = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: "ContentChannelId eq 174",
      loadAttributes: "simple",
    },
  });

  // ensure contentItems is an array
  const trips = Array.isArray(missionTrips) ? missionTrips : [missionTrips];

  return trips;
};

export type LoaderReturnType = {
  missionTrips: Trip[];
  mockCommunityData: CommunityCard[];
  mockRegionData: RegionCard[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const fetchMissions = await fetchMissionTrips();

  const missionTrips: Trip[] = fetchMissions.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.content,
    coverImage: createImageUrlFromGuid(item.attributeValues?.coverImage.value),
    missionTripUrl: item.attributeValues?.url.value,
    coordinates: {
      lat: Number(item.attributeValues?.latitude.value) || 0,
      lng: Number(item.attributeValues?.longitude.value) || 0,
    },
  }));

  return Response.json({
    missionTrips,
    mockCommunityData,
    mockRegionData,
  } as LoaderReturnType);
}

export type CommunityCard = {
  title: string;
  image: string;
  ctas: { label: string; href: string }[];
};

export type RegionCard = {
  title: string;
  image: string;
  spotsLeft: number;
  description: string;
  location: string;
  date: string;
  time: string;
  href: string;
};

const mockCommunityData: CommunityCard[] = [
  {
    title: "Card 1",
    image: "https://picsum.photos/200/300",
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
    title: "Card 2",
    image: "https://picsum.photos/200/300",
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
    title: "Card 3",
    image: "https://picsum.photos/200/300",
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

const mockRegionData: RegionCard[] = [
  {
    title: "Region 1",
    image: "https://picsum.photos/200/300",
    spotsLeft: 10,
    description:
      "Join us in making a difference in our local community through this impactful volunteer opportunity. We're looking for dedicated individuals who are passionate about serving others and creating positive change. This role involves working directly with community members, organizing resources, and collaborating with our experienced team. You'll gain valuable experience while helping those in need. Whether you're new to volunteering or have years of experience, your contribution will be valued and meaningful. Together, we can build stronger, more connected communities and touch lives in profound ways.",
    location: "Location 1",
    date: "Date 1",
    time: "Time 1",
    href: "#",
  },
  {
    title: "Region 2",
    image: "https://picsum.photos/200/300",
    spotsLeft: 8,
    description: "Description 2",
    location: "Location 2",
    date: "Date 2",
    time: "Time 2",
    href: "#",
  },
  {
    title: "Region 3",
    image: "https://picsum.photos/200/300",
    spotsLeft: 5,
    description: "Description 3",
    location: "Location 3",
    date: "Date 3",
    time: "Time 3",
    href: "#",
  },
  {
    title: "Region 4",
    image: "https://picsum.photos/200/300",
    spotsLeft: 3,
    description: "Description 4",
    location: "Location 4",
    date: "Date 4",
    time: "Time 4",
    href: "#",
  },
];
