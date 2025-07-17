import { FeatureSection } from "~/routes/page-builder/components/content-block/feature-section";

export function VolunteerWhere() {
  return (
    <section className="w-full bg-white py-12">
      <FeatureSection
        data={{
          id: 1,
          type: "CONTENT_BLOCK",
          name: "Where are you interested in?",
          content: `We want every volunteer's experience at Church to be a fulfilling journey where they feel welcomed and can share the love of Jesus. Our team engages in meaningful activities and worship, while building connections with fellow volunteers and the community. Our hope is that every volunteer understands the impact they have, knowing they are making a difference in the lives of others.`,
          layoutType: "FEATURE",
          imageLayout: "RIGHT",
          backgroundColor: "WHITE",
          aspectRatio: "1by1",
          coverImage: "/assets/images/volunteer/interested-in.webp",
        }}
        customCtas={[
          {
            title: "Volunteer at Church",
            url: "#church",
          },
          {
            title: "Volunteer in the Community",
            url: "#community",
          },
          {
            title: "Volunteer Around the Globe",
            url: "#globe",
          },
        ]}
      />
    </section>
  );
}
