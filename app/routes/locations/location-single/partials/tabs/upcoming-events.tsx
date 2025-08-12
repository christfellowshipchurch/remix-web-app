import { CardCarouselSection } from "~/components/resource-carousel";
import { GetInvolved } from "../../components/tabs-component/upcoming-events/get-involved";
import { upcomingEventsData } from "./tabs.data";

export const UpcomingEvents = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full rounded-t-[24px] md:rounded-none bg-gray pt-20 md:pt-8">
        <CardCarouselSection
          key={upcomingEventsData.id}
          title={upcomingEventsData.name}
          description={upcomingEventsData.content}
          resources={upcomingEventsData.collection || []}
          viewMoreLink="#tbd"
        />
      </div>
      <GetInvolved />
    </div>
  );
};
