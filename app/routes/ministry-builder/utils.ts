import { MinistryService, MinistryType } from "../page-builder/types";

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

  // Custom rules for mapping path segments to ministry types
  const ministryTypeRules: Record<string, string[]> = {
    kids: ["cf-kids", "kids-university"],
    students: ["students-high-school", "students-middle-school"],
    "young-adults": ["young-adults", "college-nights"],
  };

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
 * Gets the photo path for a ministry type
 */
export const getMinistryPhotoPath = (ministryType: MinistryType): string => {
  let pathName = "";
  if (
    ministryType === "students-high-school" ||
    ministryType === "students-middle-school"
  ) {
    pathName = "cf-students";
  } else {
    pathName = ministryType;
  }
  return `/assets/images/ministry-pages/services/${pathName}.webp`;
};

/**
 * Formats the days of week for a ministry service
 */
export const formatDaysOfWeek = (daysOfWeek: string) => {
  return daysOfWeek
    .split(",")
    .map((day: string) => `${day.trim()}s`)
    .join(" and ");
};
