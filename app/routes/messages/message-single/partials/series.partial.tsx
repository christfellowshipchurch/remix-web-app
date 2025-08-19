import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import { SeriesCard } from "../components/this-series-card.component";

export const InThisSeries = () => {
  const { seriesMessages } = useLoaderData<LoaderReturnType>();

  if (!seriesMessages || seriesMessages.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6 py-12 md:py-24 content-padding">
      <div className="flex flex-col gap-1 md:gap-2 w-full max-w-screen-content mx-auto">
        <h2 className="font-extrabold text-[28px] lg:text-[32px]">
          In This Series
        </h2>
        <p className="text-[#AAAAAA]">{seriesMessages[0].seriesTitle}</p>
      </div>
      <div className="flex overflow-x-auto gap-6 xl:gap-8 py-2 max-w-screen-content w-full mx-auto max-h-[300px]">
        {seriesMessages.map((message, i) => (
          <SeriesCard key={i} message={message} />
        ))}
      </div>
    </div>
  );
};
