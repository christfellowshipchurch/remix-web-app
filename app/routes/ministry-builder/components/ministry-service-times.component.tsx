import { useState, useMemo, useEffect } from "react";
import { Icon } from "~/primitives/icon/icon";
import Dropdown, {
  type DropdownOption,
} from "~/primitives/inputs/dropdown/dropdown.primitive";
import { MinistryService } from "../../page-builder/types";
import { RockCampuses } from "~/lib/rock-config";
import { ServiceCard } from "./service-card.component";
import { cn } from "~/lib/utils";
import { useLocation } from "react-router-dom";
import lodash from "lodash";
import { ministryTypeRules } from "../utils";

interface MinistryServiceTimesProps {
  services?: MinistryService[];
}

/**
 * Main Ministry Service Times Component
 */
export const MinistryServiceTimes = ({
  services = [],
}: MinistryServiceTimesProps) => {
  const { pathname } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { capitalize } = lodash;

  const pathnameTitle = pathname
    .split("/")[2]
    .split("-")
    .map((word: string) => (word !== "and" ? capitalize(word) : word))
    .join(" ");

  // Filter services to only show those relevant to the current page
  const relevantServices = useMemo(() => {
    const pathSegment = pathname.split("/")[2]?.toLowerCase() || "";

    // Find the rule whose key matches the current path segment
    const relatedMinistryTypes = ministryTypeRules[pathSegment];

    if (!relatedMinistryTypes) {
      return [];
    }

    // Filter services to only include those whose ministryType matches
    return services.filter((service) =>
      relatedMinistryTypes.includes(service.ministryType)
    );
  }, [services, pathname]);

  // Extract unique locations from relevant services
  const uniqueLocations = useMemo(() => {
    const locationSet = new Set<string>();
    relevantServices.forEach((service) => {
      locationSet.add(service.location.name);
    });
    return Array.from(locationSet).sort();
  }, [relevantServices]);

  // Create dropdown options from RockCampuses that exist in services
  const locationOptions: DropdownOption[] = useMemo(() => {
    const options: DropdownOption[] = [];

    RockCampuses.forEach((campus) => {
      if (uniqueLocations.includes(campus.name)) {
        options.push({
          value: campus.name,
          label: campus.name,
        });
      }
    });

    return options;
  }, [uniqueLocations]);

  // Filter services based on selected location
  const filteredServices = useMemo(() => {
    if (!selectedLocation) {
      return relevantServices;
    }
    return relevantServices.filter(
      (service) => service.location.name === selectedLocation
    );
  }, [relevantServices, selectedLocation]);

  // Set default location to first available if none selected
  useEffect(() => {
    if (!selectedLocation && uniqueLocations.length > 0) {
      setSelectedLocation(uniqueLocations[0]);
    }
  }, [selectedLocation, uniqueLocations]);

  // Don't render if no relevant services
  if (relevantServices.length === 0) {
    return null;
  }

  return (
    <div className="bg-navy md:bg-gray sticky bottom-0 z-10">
      {/* Title Section with Accordion Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between md:justify-center gap-2 w-full bg-dark-navy md:bg-white px-6 py-4 hover:bg-ocean/10 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
        aria-label="Toggle Service Times section"
      >
        <div className="flex items-center gap-2">
          <Icon name="calendarAlt" className="text-white md:hidden" size={20} />
          <h2 className="font-medium md:font-extrabold text-white md:text-text-primary mt-[2px]">
            {pathnameTitle} Service Times
          </h2>
        </div>
        <div className="flex items-center justify-center w-6 h-6 bg-ocean rounded-md">
          <Icon
            name="chevronUp"
            className={`text-white transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            size={20}
          />
        </div>
      </button>
      <div className="max-w-screen-content mx-auto content-padding">
        {/* Collapsible Content */}
        {isExpanded && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300 py-8">
            {/* Location Filter */}
            <div className="w-full max-w-[300px] mx-auto">
              <Dropdown
                options={locationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="Select Location"
              />
            </div>
            <hr className="border-neutral-200 w-full max-w-[500px] mx-auto" />
            {/* Service Cards Grid */}
            {filteredServices.length > 0 && (
              <div className="flex gap-4 md:justify-center overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible -mx-6">
                {filteredServices.map((service, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-shrink-0",
                      "md:flex-shrink",
                      "md:w-auto",
                      i === 0 && "ml-6 md:ml-0",
                      i === filteredServices.length - 1 && "mr-6 md:mr-0"
                    )}
                  >
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            )}
            <hr className="border-neutral-200 w-full max-w-[500px] mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};
