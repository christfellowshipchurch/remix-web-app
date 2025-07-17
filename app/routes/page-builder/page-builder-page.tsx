import { useLoaderData } from "react-router-dom";
import { PageBuilderLoader, PageBuilderSection } from "./types";
import { ResourceCarouselSection } from "~/components/page-builder/resource-section.partial";
import { CTACollectionSection } from "~/components/page-builder/cta-collection";
import { ContentBlock } from "./components/content-block";
import { ContentBlockData } from "./types";
import { ImageGallerySection } from "./components/image-gallery";
import { FAQsComponent } from "./components/faq";

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
    case "FAQ":
      if (section.faq) {
        return <FAQsComponent data={section} />;
      }

      console.error(
        "FAQ section is missing the required faq data:",
        section.id
      );
      return null;
    case "IMAGE_GALLERY":
      if (section.imageGallery) {
        return <ImageGallerySection data={section} />;
      }

      console.error(
        "Image Gallery section is missing the required imageGallery data:",
        section.id
      );
      return null;
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
  const { sections } = useLoaderData<PageBuilderLoader>();

  console.log("sections", sections);

  return (
    <div className="w-full flex flex-col">{sections.map(renderSection)}</div>
  );
}

export default PageBuilderRoute;
