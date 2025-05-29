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
    image: "/assets/images/locations/kids.jpg",
    pathname: "/kids",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "1",
  },
  {
    name: "Young Adults",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image: "/assets/images/locations/ya.jpg",
    pathname: "/young-adults",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "2",
  },
  {
    name: "Students",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image: "/assets/images/locations/students.jpg",
    pathname: "/students",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "3",
  },
  {
    name: "Groups",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.",
    image: "/assets/images/locations/groups.jpg",
    pathname: "/groups",
    contentType: "REDIRECT_CARD",
    contentChannelId: "1234",
    id: "4",
  },
];
