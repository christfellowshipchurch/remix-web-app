import { renderSection } from "~/routes/page-builder/page-builder-page";
import {
  familiesMappedChildren,
  spanishFamiliesMappedChildren,
} from "./tabs.data";

export const ForFamilies = ({ isSpanish }: { isSpanish?: boolean }) => {
  return (
    <div className="flex flex-col w-full rounded-t-[24px] md:rounded-none bg-gray pt-20 md:pt-24">
      {isSpanish
        ? spanishFamiliesMappedChildren.map((section) => renderSection(section))
        : familiesMappedChildren.map((section) => renderSection(section))}
    </div>
  );
};
