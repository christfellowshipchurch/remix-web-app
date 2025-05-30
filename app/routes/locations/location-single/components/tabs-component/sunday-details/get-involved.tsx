import { ResourceCarouselSection } from "~/components/page-builder/resource-section.partial";
import { CollectionItem } from "~/routes/page-builder/types";

export const GetInvolved = () => {
  // TODO: Update BG image
  return (
    <ResourceCarouselSection
      backgroundImage="/assets/images/locations/bg.jpg"
      title="Get Involved"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
      resources={resources}
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
    image: "/assets/images/groups-hero-bg.webp",
    pathname: "/ministries/groups",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];
