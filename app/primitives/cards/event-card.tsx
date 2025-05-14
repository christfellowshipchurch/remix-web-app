import { Event } from "~/routes/events/all-events/loader";
import { Icon } from "../icon/icon";
import { Link } from "react-router";

export const EventCard = ({ event }: { event: Event }) => {
  const { startDate, campus, image, title, attributeValues } = event;

  return (
    <Link
      to={attributeValues.url.value}
      className="flex flex-col rounded-[1rem] col-span-1 w-full max-w-[456px] h-full border border-neutral-lighter overflow-hidden"
      prefetch="intent"
    >
      <img
        src={image}
        alt={title}
        className="w-full aspect-video object-cover"
        loading="lazy"
      />

      <div className="flex flex-col gap-4 p-6 bg-white h-full">
        <ul className="flex gap-4">
          <li className="flex items-center gap-1">
            {startDate && <Icon name="calendarAlt" color="black" />}
            <p className="text-sm">{startDate}</p>
          </li>

          <li className="flex items-center gap-1">
            {campus && <Icon name="map" color="black" />}
            <p className="text-sm">{campus}</p>
          </li>
        </ul>

        <h4 className="font-bold text-2xl leading-tight text-pretty">
          {title}
        </h4>
        <p>{attributeValues.summary.value}</p>
      </div>
    </Link>
  );
};
