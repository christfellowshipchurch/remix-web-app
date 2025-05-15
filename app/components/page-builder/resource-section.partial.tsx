import { cn } from "~/lib/utils";
import { PageBuilderResourceComponent } from "./resources.component";

export const ResourceSection = ({
  className,
  title,
  description,
  resources,
  viewMoreLink,
}: {
  className?: string;
  title: string;
  description: string;
  resources: any[];
  viewMoreLink: string;
}) => {
  return (
    <div className={cn("w-full pl-5 md:pl-12 lg:pl-18", className)}>
      <div className="flex flex-col max-w-screen-content mx-auto">
        <PageBuilderResourceComponent
          title={title}
          description={description}
          resources={resources}
          viewMoreLink={viewMoreLink}
        />
      </div>
    </div>
  );
};
