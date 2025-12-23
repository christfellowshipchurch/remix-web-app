import { useLoaderData } from "react-router-dom";
import { PageBuilderLoader, PageBuilderSection } from "./types";
import { CardCarouselSection } from "~/components/resource-carousel";
import { CTACollectionSection } from "./components/cta-collection";
import { ContentBlock } from "./components/content-block";
import { ContentBlockData } from "./types";
import { ImageGallerySection } from "./components/image-gallery";
import { FAQsComponent } from "./components/faq";

export function renderSection(section: PageBuilderSection) {
  switch (section.type) {
    case "RESOURCE_COLLECTION":
    case "EVENT_COLLECTION":
      return (
        <CardCarouselSection
          key={section.id}
          title={section.name}
          description={section.content}
          resources={section.collection || []}
          viewMoreLink={section.viewMoreLink || undefined}
        />
      );
    case "CTA_COLLECTION":
      return (
        <CTACollectionSection
          key={section.id}
          title={section.name}
          description={section.content}
          resources={section.collection || []}
          viewMoreLink={section.viewMoreLink || undefined}
        />
      );
    case "FAQs":
      if (section.faqs) {
        return <FAQsComponent key={section.id} data={section} />;
      }

      console.error(
        "FAQs section is missing the required faq data:",
        section.id
      );
      return null;
    case "IMAGE_GALLERY":
      if (section.imageGallery) {
        return <ImageGallerySection key={section.id} data={section} />;
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

  return (
    <div className="w-full flex flex-col">{sections.map(renderSection)}</div>
  );
}

export default PageBuilderRoute;
