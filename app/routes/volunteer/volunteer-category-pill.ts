import { cn } from "~/lib/utils";

const VOLUNTEER_CATEGORY_PILL_BASE =
  "rounded-full px-3 py-1 text-xs font-bold";

function categoryBadgeClass(label: string): string {
  const key = label.toLowerCase().trim();

  if (key.includes("crisis")) {
    return "bg-[#F3E4E5] text-alert";
  }
  if (key.includes("hospitality")) {
    return "bg-ocean/12 text-ocean";
  }
  if (key.includes("outreach") || key.includes("community partnerships")) {
    return "bg-[#DCE5EB] text-navy";
  }
  if (key.includes("support") && key.includes("team")) {
    return "bg-[#E5F3F2] text-cotton-candy";
  }
  if (key.includes("work project")) {
    return "bg-[#E8E8EA] text-neutral-dark";
  }

  return "bg-neutral-lighter text-neutral-darker";
}

export function volunteerCategoryPillClassName(label: string): string {
  return cn(VOLUNTEER_CATEGORY_PILL_BASE, categoryBadgeClass(label));
}
