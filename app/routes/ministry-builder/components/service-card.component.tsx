import { Icon } from "~/primitives/icon/icon";
import { Button } from "~/primitives/button/button.primitive";
import { Link } from "react-router-dom";
import { MinistryService } from "../../page-builder/types";
import { formatDaysOfWeek, formattedServiceTimes } from "../utils";

interface ServiceCardProps {
  service: MinistryService;
  onLinkClick?: () => void;
}

/**
 * Service Card Component
 */
export const ServiceCard = ({ service, onLinkClick }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 w-[280px] h-full">
      {/* Ministry Photo/Logo */}
      <div className="flex justify-center">
        <img
          src={`/assets/images/ministry-pages/services/${service.ministryType}.webp`}
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
        <div className="flex items-start justify-start gap-2">
          <Icon
            name="calendarAlt"
            className="text-ocean flex-shrink-0 self-start mt-[2px]"
            size={20}
          />
          <p className="text-neutral-400">
            {formatDaysOfWeek(service.daysOfWeek)}
          </p>
        </div>

        {/* Service Times */}
        <div className="flex items-start justify-start gap-2">
          <Icon
            name="timeFive"
            className="text-ocean flex-shrink-0 self-start mt-[2px]"
            size={20}
          />
          <p className="text-neutral-400">
            {formattedServiceTimes(service.times)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="flex gap-3 mt-auto pt-2 "
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a, [href]')) {
            onLinkClick?.();
          }
        }}
      >
        {/* Primary Action Button */}
        {(service.planAVisit === true ||
          service.learnMoreLink !== undefined) && (
          <Button
            href={
              service.planAVisit
                ? "https://rock.gocf.org/CFKidsPlanaVisit" // The Plan a Visit form is not working as an embed. So we will open the Rock RMS form in a new tab for now.
                : service.learnMoreLink
            }
            intent="primary"
            size="md"
            className="w-full"
            linkClassName="flex-1"
            target={service.planAVisit ? "_blank" : undefined}
          >
            {service.planAVisit ? "Plan Your Visit" : "Learn More"}
          </Button>
        )}

        {/* Secondary Location Pin Button */}
        <Link
          to={`/locations/${service?.location?.pathname ?? ""}`}
          className="flex items-center justify-center w-11 h-11 bg-ocean text-white rounded-md hover:bg-navy transition-colors"
          aria-label={`View ${service?.location?.name ?? ""} location`}
          onClick={onLinkClick}
        >
          <Icon name="mapFilled" className="text-white" size={20} />
        </Link>
      </div>
    </div>
  );
};
