import { IconName } from "~/primitives/button/types";
import { Icon } from "~/primitives/icon/icon";
import { cn } from "~/lib/utils";
import { Link } from "react-router-dom";

export const MobileFeaturedItems = () => {
  return (
    <div className="w-full md:px-4">
      <div className="flex justify-center md:justify-start gap-3">
        <MobileFeaturedItem
          iconName="church"
          heading="Iglesia en Español"
          title="Iglesia en Español"
          url="/cfe"
          position={1}
        />
        <MobileFeaturedItem
          iconName="calendarAlt"
          heading="On Sale Now"
          title="Diesel Tickets"
          url="/events/diesel"
          position={2}
        />
      </div>
    </div>
  );
};

export const MobileFeaturedItem = ({
  iconName,
  heading,
  title,
  url,
  position,
}: {
  iconName: IconName;
  heading: string;
  title: string;
  url: string;
  position: number;
}) => {
  return (
    <Link
      to={url}
      className={cn(
        "bg-navy",
        "rounded-[24px]",
        "flex",
        "items-center",
        "justify-center",
        "gap-2",
        "py-3",
        "px-4"
      )}
      data-gtm="featured-item"
      data-position={position}
      data-item-title={title}
    >
      <Icon name={iconName} color="white" />
      <div className="text-white">
        <p className="text-xs">{heading}</p>
        <h4 className="font-bold text-sm">{title}</h4>
      </div>
    </Link>
  );
};
