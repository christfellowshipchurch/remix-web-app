import { useLoaderData } from "react-router-dom";
import {
  PageBuilderLoader,
  PageBuilderSection,
  ContentBlockData,
} from "./types";
import { DynamicHero } from "~/components";
import { ResourceCarouselSection } from "~/components/page-builder/resource-section.partial";
import { CTACollectionSection } from "~/components/page-builder/cta-collection";
import { ContentBlock } from "./components/content-block";

export function renderSection(section: PageBuilderSection) {
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
      return (
        <ContentBlock
          key={section.id}
          data={section as unknown as ContentBlockData}
        />
      );
    default:
      return (
        <div key={section.id}>
          <h2>{section.name}</h2>
          <p>{section.type}</p>
        </div>
      );
  }
}

export function PageBuilderRoute() {
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

      {sections.map(renderSection)}
    </div>
  );
}

export default PageBuilderRoute;
