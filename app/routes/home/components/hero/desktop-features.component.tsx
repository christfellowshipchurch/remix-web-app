import { IconName } from "~/primitives/button/types";
import { Icon } from "~/primitives/icon/icon";
import { cn } from "~/lib/utils";
import { Link } from "react-router-dom";

export const DesktopFeaturedItems = () => {
  return (
    <div className="w-full bg-white py-8 px-4">
      <div className="flex flex-col md:flex-row justify-center lg:justify-center gap-4 md:gap-8 lg:gap-12 xl:max-w-[600px] xl:mx-auto">
        <DesktopFeaturedItem
          iconName="messageSquareDetail"
          heading="Featured Item"
          title="Featured Item Text"
          url="sms:441-441"
          position={1}
        />
        <DesktopFeaturedItem
          iconName="church"
          heading="Comunidad Hispana"
          title="Iglesia en Español"
          url="#cfe"
          position={2}
        />
      </div>
    </div>
  );
};

const DesktopFeaturedItem = ({
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
        "bg-navy-subdued",
        "rounded-xl",
        "flex",
        "gap-4",
        "group",
        "p-4",
        "w-full",
        "md:max-w-[304px]",
        "lg:bg-transparent",
        "lg:rounded-none",
        "lg:items-center",
        "lg:justify-center",
        "lg:gap-2",
        "lg:p-0",
        "lg:w-auto",
        "lg:max-w-none"
      )}
      data-gtm="featured-item"
      data-position={position}
      data-item-title={title}
    >
      <div className="bg-ocean lg:bg-dark-navy group-hover:bg-ocean transition-colors duration-300 rounded-sm p-2 ">
        <Icon name={iconName} color="white" />
      </div>
      <div>
        <p className="text-sm text-text-secondary">{heading}</p>
        <h4 className="font-bold">{title}</h4>
      </div>
    </Link>
  );
};
