import { SectionTitle } from "~/components";
import { ResourceCarousel } from "~/components/page-builder/resource-section.partial";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import { VolunteerAtChurchCard } from "../components/cards/volunteer-at-church-card.component";
import { cn } from "~/lib/utils";

export function VolunteerAtChurch() {
  return (
    <section id="church" className="w-full bg-navy py-24 ">
      <div className="flex flex-col gap-12 w-full">
        {/* Placeholder component for the carousel */}
        <div className="content-padding w-full flex items-center">
          <div className="flex flex-col gap-12 w-full max-w-screen-content mx-auto">
            <SectionTitle sectionTitle="Join the Dream Team" />
            <h2 className="text-[40px] md:text-[52px] font-extrabold leading-none text-white md:-mb-12">
              Volunteer At Church
            </h2>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="w-full lg:hidden content-padding">
          <ResourceCarousel
            mode="dark"
            CardComponent={VolunteerAtChurchCard}
            resources={tempResources}
          />
        </div>

        {/* Desktop Scrollable Carousel */}
        <div className="hidden lg:flex gap-4 mt-8 3xl:px-18">
          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-hide 3xl:mx-auto 3xl:max-w-screen-content">
            {tempResources.map((resource, index) => (
              <div
                className={cn(
                  index === 0 && "pl-5 md:pl-12 lg:pl-18 3xl:pl-0",
                  index === tempResources.length - 1 && "pr-18"
                )}
                key={index}
              >
                <VolunteerAtChurchCard resource={resource} />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full content-padding">
          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-7 max-w-screen-content mx-auto">
            <p className="w-fit text-white text-center md:max-w-[60%] lg:max-w-none md:text-left text-xl font-semibold text-pretty">
              Let's find the right fit for you. Just fill out your information,
              and we'll help with the rest.
            </p>
            <IconButton
              to="#todo"
              withRotatingArrow
              className="text-white border-white rounded-full w-[200px]"
            >
              Discover My Fit
            </IconButton>
          </div>
        </div>
      </div>
    </section>
  );
}

const tempResources = [
  {
    id: "1",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Creative Team",
    description: "Creative & Production",
    summary:
      "Do you enjoy turning ideas into reality with technology or storytelling? If you're creative and passionate, this team is your stage to inspire and communicate effectively.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/creative-team",
  },
  {
    id: "2",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Kids Ministry",
    description: "Next Generation",
    summary:
      "Help shape the next generation by creating fun, safe environments where kids can learn about Jesus. Your impact will last a lifetime.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/kids",
  },
  {
    id: "3",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Guest Services",
    description: "First Impressions",
    summary:
      "Be the friendly face that welcomes people to church. From parking to seating, help create an inviting atmosphere for everyone who visits.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/guest-services",
  },
  {
    id: "4",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Worship Team",
    description: "Music & Production",
    summary:
      "Use your musical talents to lead others in worship. Whether you sing, play an instrument, or work with audio/visual, there's a place for you.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/worship",
  },
  {
    id: "5",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Prayer Team",
    description: "Prayer Ministry",
    summary:
      "Join a team dedicated to praying for others. Provide spiritual support and encouragement to those seeking prayer and guidance.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/prayer",
  },
  {
    id: "6",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Student Ministry",
    description: "Youth & Students",
    summary:
      "Make a difference in teenagers' lives by mentoring, leading small groups, and creating an engaging environment for students to grow in faith.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/students",
  },
  {
    id: "7",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Care Team",
    description: "Pastoral Care",
    summary:
      "Support people during life's challenges through hospital visits, grief support, and practical assistance. Show God's love in tangible ways.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/care",
  },
  {
    id: "8",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Small Groups",
    description: "Community Groups",
    summary:
      "Lead or host a small group where people can connect, grow spiritually, and build meaningful relationships in a comfortable setting.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/groups",
  },
  {
    id: "9",
    contentChannelId: "1",
    contentType: "REDIRECT_CARD" as const,
    name: "Events Team",
    description: "Special Events",
    summary:
      "Help plan and execute church events that bring the community together. From setup to coordination, make memorable experiences happen.",
    image: "https://picsum.photos/200/300",
    pathname: "/volunteer/events",
  },
];
