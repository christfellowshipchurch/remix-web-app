import { renderSection } from "~/routes/page-builder/page-builder-page";
import { familiesMappedChildren } from "./tabs.data";

export const ForFamilies = () => {
  return (
    <div className="flex flex-col w-full rounded-t-[24px] md:rounded-none bg-gray pt-8 md:pt-24">
      {familiesMappedChildren.map((section) => renderSection(section))}
    </div>
  );
};
