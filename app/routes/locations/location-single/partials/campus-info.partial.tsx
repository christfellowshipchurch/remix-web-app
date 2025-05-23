import { VirtualTour } from "../components/virtual-tour.component";

export const CampusInfo = () => {
  return (
    <div className="w-full content-padding">
      <div className="w-full mx-auto max-w-screen-content flex flex-col lg:flex-row gap-8 lg:gap-0 lg:justify-between pt-16 pb-32">
        {/* Location Info */}
        <div className="flex-1"></div>

        {/* Tour */}
        <div className="flex-1 pt-16">
          <VirtualTour wistiaId={"ypgfkoi9u2"} />
        </div>
      </div>
    </div>
  );
};
