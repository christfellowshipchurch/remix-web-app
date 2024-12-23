import Icon from "~/primitives/icon";
import { Event } from "../loader";

export const EventCard = ({ data }: { data: Event }) => {
  return (
    <div className="flex flex-col gap-5 col-span-1 w-full max-w-[430px]">
      <div className="flex flex-col gap-1">
        <img src={data?.image} className="w-[430px] h-[280px] object-cover" />
        <div className="flex gap-1 pt-1">
          <div className="flex gap-1">
            <Icon name="calendarAlt" color="#666666" />
            <p className="font-medium  text-[#666666]">{data.eventDate}</p>
          </div>
          <div className="flex gap-1">
            <Icon name="map" color="#666666" />
            <p className="font-medium  text-[#666666]">
              {/* TODO: Setup Campuses */}
              {data.campus || "All Campuses"}
            </p>
          </div>
        </div>
        <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-extrabold text-3xl leading-8">{data?.title}</h3>
        <a className="font-bold underline">Learn More</a>
      </div>
    </div>
  );
};
