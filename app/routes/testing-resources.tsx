import { mockEvents } from "~/components/page-builder/events-mock-data";
import { ResourceSection } from "~/components/page-builder/resource-section.partial";

const TestingResources = () => {
  return (
    <ResourceSection
      title="Resources"
      description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
      resources={mockEvents}
      viewMoreLink="/events"
      className="bg-gray"
    />
  );
};

export default TestingResources;
