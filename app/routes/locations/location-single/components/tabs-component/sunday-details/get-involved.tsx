import { CardCarouselSection } from "~/components/resource-carousel";
import { cn } from "~/lib/utils";
import { CollectionItem } from "~/routes/page-builder/types";

export const GetInvolved = ({ isOnline }: { isOnline?: boolean }) => {
  return (
    <CardCarouselSection
      backgroundImage={
        !isOnline ? "/assets/images/locations/bg.jpg" : undefined
      }
      className={cn(
        isOnline ? "bg-gradient-to-br from-[#1C3647] to-ocean" : ""
      )}
      title="Get Involved"
      resources={isOnline ? onlineResources : resources}
      viewMoreLink="/next-steps"
      mode="dark"
    />
  );
};

const resources: CollectionItem[] = [
  {
    name: "Kids",
    summary:
      "For Newborns Through Elementary School - Christ Fellowship Kids is designed to partner with parents as together, we lead our kids to love Jesus, love others, and love life.",
    image: "/assets/images/locations/get-involved/kids.webp",
    pathname: "/ministries/kids",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Students",
    summary:
      "For Middle School & High School Students - A place where your student can grow in their relationship with Jesus and their relationships with others.",
    image: "/assets/images/locations/get-involved/students.webp",
    pathname: "/ministries/students",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Young Adults",
    summary:
      "For College Students & Young Adults - The perfect place for those who are looking to grow their relationship with Jesus as well as connect with other young adults throughout South Florida.",
    image: "/assets/images/locations/get-involved/ya.webp",
    pathname: "/ministries/young-adults",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Groups & Classes",
    summary:
      "For Everyone - Everything you need to get connected and grow in your faith.",
    image: "/assets/images/groups-bg.webp",
    pathname: "/group-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];

const onlineResources: CollectionItem[] = [
  {
    name: "Journey",
    summary: "Your first step to getting connected!",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=5cbd4b27-2ff1-4e5c-ae77-45b51399be94&quality=20",
    pathname: "/event-finder/journey",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Volunteer",
    summary:
      "Volunteer with others to help make a difference in the lives of others.",

    image: "/assets/images/volunteer/hero.webp",
    pathname: "/volunteer",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Classes",
    summary: "Take a class to grow in your faith and connect with others.",
    image: "/assets/images/volunteer/interested-in.webp", // TODO: This image needs to be updated
    pathname: "/class-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Groups",
    summary: "Join a group to grow in your faith and connect with others.",
    image: "/assets/images/groups-bg.webp",
    pathname: "/group-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];
