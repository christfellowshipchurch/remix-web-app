import { SectionTitle } from "~/components";
import { ResourceCarousel } from "~/components/page-builder/resource-section.partial";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export function VolunteerAtChurch() {
  return (
    <section id="church" className="w-full bg-navy py-24">
      <div className="max-w-screen-content mx-auto padding-content flex flex-col gap-12">
        <SectionTitle sectionTitle="Join the Dream Team" />
        <h2 className="heading-h2 -mb-24 text-white">Volunteer at Church</h2>
        {/* Placeholder component for the carousel */}
        <ResourceCarousel
          resources={[
            {
              id: "1",
              contentChannelId: "1",
              contentType: "EVENT",
              name: "Volunteer at Church",
              summary: "Volunteer at Church",
              image: "https://picsum.photos/200/300",
              pathname: "/volunteer/chula-vista",
            },
            {
              id: "2",
              contentChannelId: "1",
              contentType: "EVENT",
              name: "Volunteer at Church",
              summary: "Volunteer at Church",
              image: "https://picsum.photos/200/300",
              pathname: "/volunteer/chula-vista",
            },
            {
              id: "3",
              contentChannelId: "1",
              contentType: "EVENT",
              name: "Volunteer at Church",
              summary: "Volunteer at Church",
              image: "https://picsum.photos/200/300",
              pathname: "/volunteer/chula-vista",
            },
          ]}
        />
        <div className="w-full flex justify-center items-center gap-4 mt-20">
          <p className="text-white text-lg font-semibold">
            Let’s find the right fit for you. Just fill out your information,
            and we’ll help with the rest.
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
