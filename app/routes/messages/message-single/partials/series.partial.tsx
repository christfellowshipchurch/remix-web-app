import { SeriesCard } from "../components/this-series-card.component";
import { mockInThisSeries } from "../components/mockData";

export const InThisSeries = () => {
  // Get Series ID and get episodes in this series
  return (
    <div className="flex w-full flex-col gap-6 py-12 md:py-24 content-padding">
      <div className="flex flex-col gap-1 md:gap-2 w-full max-w-screen-content mx-auto">
        <h2 className="font-extrabold text-[28px] lg:text-[32px]">
          In This Series
        </h2>
        <p className="text-[#AAAAAA]">How to Master Your Money</p>
      </div>
      {/* Other Series Messages */}
      <div className="flex overflow-x-auto gap-6 xl:gap-8 pb-2 max-w-screen-content w-full mx-auto">
        {mockInThisSeries.map((message, i) => (
          <SeriesCard key={i} data={message} />
        ))}
      </div>
    </div>
  );
};
