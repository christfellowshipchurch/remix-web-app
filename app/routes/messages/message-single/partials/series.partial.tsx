import { useLoaderData } from "react-router";
import { MessageReturnType } from "../loader";
import { SeriesCard } from "../components/this-series-card.component";
import { mockInThisSeries } from "../components/mockData";

export const InThisSeries = () => {
  const { message } = useLoaderData<MessageReturnType>();
  // Get Series ID and get episodes in this series
  return (
    <div className="flex w-full flex-col gap-6 py-12 md:py-24 lg:max-w-xl xl:max-w-xxl">
      <div className="flex flex-col gap-2">
        <h2 className="heading-h3">In This Series</h2>
        {/* Series Description */}
        <p className="text-[#AAAAAA]">How to Master Your Money</p>
      </div>
      {/* Other Series Messages */}
      <div className="grid grid-cols-4 gap-6 xl:gap-8 pb-2">
        {mockInThisSeries.map((message, i) => (
          <SeriesCard key={i} data={message} />
        ))}
      </div>
    </div>
  );
};
