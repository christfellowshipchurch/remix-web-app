import { Event } from "~/routes/events/all-events/loader";
import { Icon } from "../icon/icon";
import { Link } from "react-router";

export const EventCard = ({ event }: { event: Event }) => {
  const { startDate, campus, image, title, attributeValues } = event;
  return (
    <Link
      to={attributeValues.url.value}
      className="flex flex-col rounded-[8px] gap-5 col-span-1 w-full h-full max-w-[430px]"
      prefetch="intent"
    >
      <div className="flex flex-col gap-1">
        <img
          src={image}
          alt={title}
          className="w-full aspect-[4/3] object-cover rounded-lg"
          loading="lazy"
        />
        <ul className="flex gap-3 pt-1">
          <li className="flex gap-1">
            {startDate && <Icon name="calendarAlt" color="#666666" />}
            <p className="font-medium text-text-secondary">{startDate}</p>
          </li>

          <li className="flex gap-1">
            {campus && <Icon name="map" color="#666666" />}
            <p className="font-medium text-text-secondary">{campus}</p>
          </li>
        </ul>
        <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <h3 className="font-extrabold text-[28px] leading-8 text-pretty">
          {title}
        </h3>
      </div>
    </Link>
  );
};
