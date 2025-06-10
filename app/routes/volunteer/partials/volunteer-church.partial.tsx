import { SectionTitle } from "~/components";
import { ResourceCarousel } from "~/components/page-builder/resource-section.partial";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import { VolunteerAtChurchCard } from "../components/volunteer-at-church-card.component";
import { cn } from "~/lib/utils";

export function VolunteerAtChurch() {
  return (
    <section className="w-full bg-navy pl-5 md:pl-12 lg:pl-18 py-24">
      <div className="max-w-screen-content mx-auto padding-content flex flex-col gap-12">
        <SectionTitle sectionTitle="Join the Dream Team" />
        <h2 className="heading-h2 -mb-24 text-white">Volunteer At Church</h2>
        {/* Placeholder component for the carousel */}

        {/* Mobile Carousel */}
        <div className="w-full lg:hidden">
          <ResourceCarousel
            mode="dark"
            CardComponent={VolunteerAtChurchCard}
            resources={TempResources}
          />
        </div>

        {/* Desktop Scrollable Carousel */}
        <div className="hidden lg:flex gap-4">
          {/* TODO: Change carousel to a scrollable one */}
          <ResourceCarousel
            mode="dark"
            CardComponent={VolunteerAtChurchCard}
            resources={TempResources}
          />
        </div>

        <div className="w-full flex justify-center items-center gap-7 mt-20">
          <p className="text-white text-lg font-semibold">
            Let's find the right fit for you. Just fill out your information,
            and we'll help with the rest.
          </p>
          <IconButton
            to="#todo"
            withRotatingArrow
            className="text-white border-white rounded-full"
          >
            Discover My Fit
          </IconButton>
        </div>
      </div>
    </section>
  );
}

const TempResources = [
  {
    id: "1",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Volunteer at Church",
    description: "Volunteer at Church",
    summary:
      "Do you enjoy turning ideas into reality with technology or storytelling? If you're creative and passionate, this team is your stage to inspire and communicate effectively.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/chula-vista",
  },
  {
    id: "2",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Volunteer at Church",
    description: "Volunteer at Church",
    summary:
      "Do you enjoy turning ideas into reality with technology or storytelling? If you're creative and passionate, this team is your stage to inspire and communicate effectively.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/chula-vista",
  },
  {
    id: "3",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Volunteer at Church",
    description: "Volunteer at Church",
    summary:
      "Do you enjoy turning ideas into reality with technology or storytelling? If you're creative and passionate, this team is your stage to inspire and communicate effectively.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/chula-vista",
  },
  {
    id: "4",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Volunteer at Church",
    description: "Volunteer at Church",
    summary:
      "Do you enjoy turning ideas into reality with technology or storytelling? If you're creative and passionate, this team is your stage to inspire and communicate effectively.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/chula-vista",
  },
];
