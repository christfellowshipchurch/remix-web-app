import { Icon } from "~/primitives/icon/icon";
import { Button } from "~/primitives/button/button.primitive";
import { Link } from "react-router-dom";
import { MinistryService } from "../../page-builder/types";
import { getMinistryPhotoPath } from "../utils";

/**
 * Service Card Component
 */
export const ServiceCard = ({ service }: { service: MinistryService }) => {
  const photoPath = getMinistryPhotoPath(service.ministryType);
  const primaryButtonText = service.planYourVisit
    ? "Plan my Visit"
    : "Learn More";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 w-[280px]">
      {/* Ministry Photo/Logo */}
      <div className="flex justify-center">
        <img
          src={photoPath}
          alt={service.ministryType}
          className="h-[120px] w-auto object-contain"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </div>

      {/* Schedule Information */}
      <div className="flex flex-col gap-3">
        {/* Days of Week */}
        <div className="flex items-start gap-2">
          <Icon
            name="calendarAlt"
            className="text-ocean flex-shrink-0 mt-1"
            size={20}
          />
          <p className="text-neutral-400 font-medium">{service.daysOfWeek}</p>
        </div>

        {/* Service Times */}
        <div className="flex items-start gap-2">
          <Icon
            name="timeFive"
            className="text-ocean flex-shrink-0 mt-1"
            size={20}
          />
          <p className="text-neutral-400 font-medium">{service.times}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-2 ">
        {/* Primary Action Button */}
        <Button
          href={service.learnMoreLink}
          intent="primary"
          size="md"
          className="w-full"
          linkClassName="flex-1"
        >
          {primaryButtonText}
        </Button>

        {/* Secondary Location Pin Button */}
        <Link
          to={service.location.link}
          className="flex items-center justify-center w-11 h-11 bg-ocean text-white rounded-md hover:bg-navy transition-colors"
          aria-label={`View ${service.location.name} location`}
        >
          <Icon name="mapFilled" className="text-white" size={20} />
        </Link>
      </div>
    </div>
  );
};
