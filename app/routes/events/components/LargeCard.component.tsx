import { Event } from "../loader";

// TODO: Fix weird bug that is causing that small border on the right side of the content
export const LargeCard = ({ card }: { card: Event }) => {
  return (
    <div className="relative w-[90vw] lg:w-[82vw] max-w-[1440px] bg-white">
      {/* Image */}
      <img src={card.image} className="w-full md:h-[520px] lg:h-[660px]" />
      {/* Content */}
      <div className="absolute md:w-[72%] lg:w-[64%] xl:w-[90%] xl:max-w-[1011px] h-[270px] flex flex-col justify-start gap-6 pl-12 pt-12 xl:pl-16 xl:pt-16 pb-2 right-0 bottom-0 bg-white ">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-[16px] text-[#666666]">
            HAPPENING AT ALL CAMPUS LOCATIONS
          </h2>
          <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
        </div>
        <div className="flex flex-col gap-2 pr-12 xl:pr-16">
          <h3 className="font-bold text-[24px]">{card.title}</h3>
          <p className="font-normal text-[#666666]">
            {card.attributeValues.summary.value}
          </p>
          <a className="underline font-bold cursor-pointer">Learn More</a>
        </div>
      </div>
    </div>
  );
};
