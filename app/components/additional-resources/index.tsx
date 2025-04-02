import { Link } from "react-router";
import { Button } from "~/primitives/button/button.primitive";

export const AdditionalResources = ({
  type,
  resources,
}: {
  type: "button" | "card";
  resources: any[];
}) => {
  return (
    <div className="max-w-screen-content flex flex-col gap-12 w-full">
      <h2 className="font-extrabold text-[32px]">Additional Resources</h2>
      {(() => {
        switch (type) {
          case "card":
            return <AdditionalResourcesCards resources={resources} />;
          case "button":
          default:
            return <AdditionalResourcesButtons resources={resources} />;
        }
      })()}
    </div>
  );
};

type Resource = {
  title: string;
  image: string;
  url: string;
};

const AdditionalResourcesButtons = ({
  resources,
}: {
  resources: Resource[];
}) => {
  return (
    <div className="flex flex-wrap gap-6 mt-2">
      {resources.map((resource, index) => (
        <Button key={index} intent="secondary" href={resource.url}>
          {resource.title}
        </Button>
      ))}
    </div>
  );
};

const AdditionalResourcesCards = ({ resources }: { resources: Resource[] }) => {
  return (
    <div className="flex flex-wrap gap-8">
      {resources.map((resource, index) => (
        <ResourceCard resource={resource} key={index} />
      ))}
    </div>
  );
};

const ResourceCard = ({ resource }: { resource: Resource }) => {
  return (
    <Link
      to={resource.url}
      className="flex flex-col w-[320px] rounded-lg border border-[#CCCCCC] overflow-hidden"
    >
      <img
        src={resource.image}
        alt={resource.title}
        className="w-full h-[240px] object-cover"
      />
      <h3 className="font-bold text-[24px] p-4">{resource.title}</h3>
    </Link>
  );
};

export default AdditionalResources;
