import { ResourceCarouselSection } from "~/components/page-builder/resource-section.partial";
import { GetInvolved } from "../../components/tabs-component/upcoming-events/get-involved";
import { upcomingEventsData } from "./tabs.data";

export const UpcomingEvents = () => {
  return (
    <div className="flex flex-col w-full">
      <ResourceCarouselSection
        key={upcomingEventsData.id}
        title={upcomingEventsData.name}
        description={upcomingEventsData.content}
        resources={upcomingEventsData.collection || []}
        viewMoreLink="#tbd"
      />
      <GetInvolved />
    </div>
  );
};
