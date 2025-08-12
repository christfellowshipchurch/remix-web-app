import { CardCarouselSection } from "~/components/resource-carousel";
import { CollectionItem } from "~/routes/page-builder/types";

export const GetInvolved = ({ isOnline }: { isOnline?: boolean }) => {
  // TODO: Update BG image
  return (
    <CardCarouselSection
      backgroundImage="/assets/images/locations/bg.jpg"
      title="Get Involved"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=30f01384-367f-4eb0-9015-b8ab4c281563&quality=20",
    pathname: "/ministries/kids",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Young Adults",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=fef0535a-8f41-4b5e-9fe1-ac4c6be7b411&quality=20",
    pathname: "/ministries/young-adults",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Students",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=09476292-7708-4884-8f10-9e3042c4e35f&quality=20",
    pathname: "/ministries/students",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Groups",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image: "/assets/images/groups-bg.webp",
    pathname: "/ministries/groups",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];

const onlineResources: CollectionItem[] = [
  {
    name: "Journey",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=5cbd4b27-2ff1-4e5c-ae77-45b51399be94&quality=20",
    pathname: "/journey",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Volunteer",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    // TODO: Update image once we have the correct one in Rock
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=fef0535a-8f41-4b5e-9fe1-ac4c6be7b411&quality=20",
    pathname: "/volunteer",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Classes",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    // TODO: Update image once we have the correct one in Rock
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=fef0535a-8f41-4b5e-9fe1-ac4c6be7b411&quality=20",
    pathname: "/class-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Groups",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image:
      "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=fef0535a-8f41-4b5e-9fe1-ac4c6be7b411&quality=20",
    pathname: "/group-finder",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];
