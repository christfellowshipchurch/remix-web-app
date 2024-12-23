import { Event } from "../loader";

export const FeaturedCard = ({ card }: { card: Event }) => {
  return (
    <div
      className="relative w-[90vw] aspect-[16/9] md:w-full max-w-[1440px] inset-0 bg-cover bg-center object-cover"
      style={{
        backgroundImage: `url(${card.image})`,
      }}
    >
      <div className="absolute w-2/3 right-0 bottom-0 bg-white flex flex-col justify-start gap-6 pl-16 pt-16 pb-4">
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
