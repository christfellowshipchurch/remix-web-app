import { MinistryService } from "../page-builder/types";

// Custom rules for mapping path segments to ministry types
export const ministryTypeRules: Record<string, string[]> = {
  kids: ["cf-kids", "kids-university"],
  students: ["students", "the-mix"],
  "young-adults": ["young-adults", "college-nights"],
  "care-and-assistance": ["celebrate-recovery"],
};

/**
 * Determines if the service times should be displayed based on the current path
 */
export function displayServiceTimes(
  services: MinistryService[],
  pathname: string
): boolean {
  if (!services || services.length === 0) {
    return false;
  }

  // Find the first rule whose key is included in the current path
  const relatedMinistryTypes = Object.entries(ministryTypeRules).find(
    ([segment]) => pathname.startsWith(segment)
  )?.[1];

  if (!relatedMinistryTypes) {
    return false;
  }

  // If any ministryType matches one in services, display service times
  return services.some((service) =>
    relatedMinistryTypes.includes(service.ministryType)
  );
}

/**
 * Formats the days of week for a ministry service
 */
export const formatDaysOfWeek = (daysOfWeek: string) => {
  return daysOfWeek
    .split(",")
    .map((day: string) => `${day.trim()}s`)
    .join(" and ");
};

/**
 * Formats the service times for a ministry service
 */
export const formattedServiceTimes = (serviceTimes: string) => {
  return serviceTimes.split("|").join(", ");
};
