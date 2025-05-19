import { useLoaderData } from "react-router";
import { PageBuilderLoader } from "./page-builder/types";
import { DynamicHero } from "~/components";
import { ResourceCarouselSection } from "~/components/page-builder/resource-section.partial";
import { CTACollectionSection } from "~/components/page-builder/cta-collection";

// Page Builder Route
export { loader } from "./page-builder/loader";

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

      {sections.map(
        (section) =>
          ((section.type === "RESOURCE_COLLECTION" ||
            section.type === "EVENT_COLLECTION") && (
            <ResourceCarouselSection
              title={section.name}
              description={section.content}
              resources={section.collection}
              viewMoreLink="#tbd"
            />
          )) ||
          (section.type === "CTA_COLLECTION" && (
            <CTACollectionSection
              title={section.name}
              description={section.content}
              resources={section.collection}
              viewMoreLink="#tbd"
            />
          )) || (
            <div>
              <h2>{section.name}</h2>
              <p>{section.type}</p>
            </div>
          )
      )}
    </div>
  );
}

export default PageBuilderRoute;
