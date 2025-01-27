import { Link } from "react-router";
import { Event } from "../loader";

export const FeaturedCardMobile = ({ card }: { card: Event }) => {
  return (
    <div className="flex flex-col w-full gap-6">
      <div
        className="w-full aspect-video bg-cover bg-center"
        style={{
          backgroundImage: `url(${card.image})`,
        }}
      />
      <div className="flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-[16px] text-[#666666]">
            HAPPENING AT ALL CAMPUS LOCATIONS
          </h2>
          <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-[24px]">{card.title}</h3>
          <p className="font-normal text-[#666666]">
            {card.attributeValues.summary.value}
          </p>
          <Link
            to={`/events/${card.attributeValues.url.value}`}
            prefetch="intent"
            className="underline font-bold cursor-pointer"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};
