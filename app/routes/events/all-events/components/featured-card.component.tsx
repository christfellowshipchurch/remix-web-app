import { Link } from "react-router";
import { Event } from "../loader";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import HtmlRenderer from "~/primitives/html-renderer";

export const FeaturedEventCard = ({ card }: { card: Event }) => {
  const { title, image, startDate, campus, attributeValues, content } = card;

  return (
    <div className="flex flex-col md:h-[400px] lg:h-[420px] xl:h-[450px] md:flex-row items-center justify-center size-full overflow-hidden rounded-[1rem] border border-neutral-lighter">
      <img
        src={image}
        alt={title}
        className="w-full md:w-1/2 aspect-video md:aspect-auto max-w-[720px] h-full object-cover"
      />

      <div className="flex flex-col justify-center gap-4 bg-white p-5 md:p-12 w-full md:h-[400px] lg:h-[420px] xl:h-[450px]">
        <div className="flex flex-col gap-4">
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

          <h4 className="font-extrabold text-[28px] leading-tight text-pretty">
            {title}
          </h4>
          {attributeValues?.summary?.value ? (
            <p>{attributeValues.summary.value}</p>
          ) : (
            <HtmlRenderer html={content || ""} className="line-clamp-5" />
          )}
        </div>
        <Link to={`/events/${attributeValues.url.value}`} prefetch="intent">
          <Button intent="secondary" className="font-normal">
            Save my spot
          </Button>
        </Link>
      </div>
    </div>
  );
};
