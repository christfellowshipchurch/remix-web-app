import { useLoaderData } from "react-router";
import { PageBuilderLoader } from "./page-builder/types";
import { DynamicHero } from "~/components";
import { ResourceCarouselSection } from "~/components/page-builder/resource-section.partial";
import { CTACollectionSection } from "~/components/page-builder/cta-collection";
import { ContentBlock } from "./page-builder/components/content-block";
import { ContentBlockData } from "./page-builder/types";
// Page Builder Route
export { loader } from "./page-builder/loader";

const mockContentBlock: ContentBlockData = {
  id: 19001,
  type: "CONTENT_BLOCK",
  name: "Testing Feature Section",
  content:
    "We know life is busy, and your children are growing fast. At Christ Fellowship Kids, we want to partner with you to make the most of your child’s formative years and help them build a strong foundation of faith. We have weekly programming offered on Sundays as well as a mid-week discipleship program during the week.",
  layoutType: "FULLSCREEN",
  subtitle: "FROM BABIES THROUGH ELEMENTARY",
  callsToAction:
    "Find a campus near you^#testing|Plan your first visit^#testing|Plan your first visit^#testing|Plan your first visit^#testing",
  coverImage:
    "https://cloudfront.christfellowship.church/GetImage.ashx/GetImage.ashx?guid=004a5603-8a3c-4391-9fae-499ca3684061",
  aspectRatio: "1by1",
  imageLayout: "LEFT",
  backgroundColor: "WHITE",
};

function PageBuilderRoute() {
  const { title, heroImage, callsToAction, sections } =
    useLoaderData<PageBuilderLoader>();

  return (
    <div>
      <DynamicHero
        customTitle={title}
        imagePath={heroImage}
        ctas={callsToAction.map((cta) => ({
          href: cta.url,
          title: cta.title,
        }))}
      />

      {sections.map((section) => {
        switch (section.type) {
          case "RESOURCE_COLLECTION":
          case "EVENT_COLLECTION":
            return (
              <ResourceCarouselSection
                key={section.id}
                title={section.name}
                description={section.content}
                resources={section.collection || []}
                viewMoreLink="#tbd"
              />
            );
          case "CTA_COLLECTION":
            return (
              <CTACollectionSection
                key={section.id}
                title={section.name}
                description={section.content}
                resources={section.collection || []}
                viewMoreLink="#tbd"
              />
            );
          case "CONTENT_BLOCK":
            return <ContentBlock key={section.id} data={mockContentBlock} />;
          default:
            return (
              <div key={section.id}>
                <h2>{section.name}</h2>
                <p>{section.type}</p>
              </div>
            );
        }
      })}
    </div>
  );
}

export default PageBuilderRoute;
