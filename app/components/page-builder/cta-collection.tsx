import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { ResourceCard } from "~/primitives/cards/resource-card";
import { CollectionItem } from "~/routes/page-builder/types";

export const CTACollectionSection = ({
  className,
  title,
  description,
  resources,
  viewMoreLink,
}: {
  className?: string;
  title: string;
  description: string;
  resources: CollectionItem[];
  viewMoreLink: string;
}) => {
  return (
    <div className={cn("w-full content-padding", className)}>
      <div className="flex flex-col max-w-screen-content mx-auto">
        <PageBuilderCTACollection
          title={title}
          description={description}
          resources={resources}
          viewMoreLink={viewMoreLink}
        />
      </div>
    </div>
  );
};

interface PageBuilderCTACollectionProps {
  viewMoreLink: string;
  title: string;
  description: string;
  resources: CollectionItem[];
}

const PageBuilderCTACollection = ({
  title,
  viewMoreLink,
  description,
  resources,
}: PageBuilderCTACollectionProps) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col items-center py-16 md:py-24 lg:py-28">
        {/* Header */}
        <div className="w-full flex items-center justify-between pr-5 md:pr-12 lg:pr-18">
          <div className="flex flex-col gap-2">
            <h2 className="text-text font-extrabold text-[40px] md:text-[32px] leading-tight">
              {title}
            </h2>
            <p className="md:text-lg">{description}</p>
          </div>

          <Button
            href={viewMoreLink}
            size="md"
            className="hidden md:block"
            intent="secondary"
          >
            View All
          </Button>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 pb-12 grid-rows-2 overflow-hidden">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="w-full flex justify-start mt-8">
          <Button
            href={viewMoreLink}
            size="md"
            className="md:hidden"
            intent="secondary"
          >
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};
