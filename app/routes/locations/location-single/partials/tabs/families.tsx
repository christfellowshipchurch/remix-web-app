import { useLoaderData } from "react-router-dom";
import { CTACollectionSection } from "~/components/page-builder/cta-collection";
import { ResourceCarouselSection } from "~/components/page-builder/resource-section.partial";
import { ContentBlock } from "~/routes/page-builder/components/content-block";
import { ContentBlockData } from "~/routes/page-builder/types";
import { LoaderReturnType } from "../../loader";

export const ForFamilies = () => {
  const { familiesMappedChildren } = useLoaderData<LoaderReturnType>();
  return (
    <div className="flex flex-col w-full bg-gray pt-8 md:pt-24">
      {familiesMappedChildren.map((section) => {
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
      })}
    </div>
  );
};
