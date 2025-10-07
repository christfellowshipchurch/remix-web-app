import { IconName } from "~/primitives/button/types";
import { Icon } from "~/primitives/icon/icon";
import { cn } from "~/lib/utils";
import { Link } from "react-router-dom";

export const MobileFeaturedItems = () => {
  return (
    <div className="w-full">
      <div className="flex justify-center md:justify-start gap-2">
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
        "rounded-full",
        "flex",
        "items-center",
        "justify-center",
        "gap-2",
        "py-3",
        "px-3 sm:px-4",
        "min-w-[100px]",
        "max-w-[50%]"
      )}
      data-gtm="featured-item"
      data-position={position}
      data-item-title={title}
    >
      <Icon name={iconName} color="white" className="min-w-[24px]" />
      <div className="text-white">
        <p className="text-[10px] sm:text-xs line-clamp-1">{heading}</p>
        <h4 className="font-bold text-xs sm:text-sm line-clamp-1">{title}</h4>
      </div>
    </Link>
  );
};
