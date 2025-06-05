import { RefinementList } from "react-instantsearch";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { MenuSelect } from "~/routes/group-finder/finder/components/custom-menu.component";

export const CustomRefinementList = ({ attribute }: { attribute: string }) => {
  return (
    <RefinementList
      classNames={{
        list: "flex flex-col gap-3",
        checkbox: "hidden",
        count: "hidden",
        labelText: "text-xl font-bold",
        item: "flex items-center justify-center rounded-full border-2 border-[#D0D0CE] text-[#D0D0CE] px-12 text-center",
        selectedItem:
          "bg-ocean-subdued text-ocean border-2 border-ocean overflow-hidden rounded-full",
        label:
          "flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer",
      }}
      attribute={attribute}
    />
  );
};

export function DesktopGroupFilters() {
  return (
    <div className="flex gap-4 w-full bg-white col-span-1 h-full min-w-[300px] items-center">
      <div className="hidden lg:flex gap-4 w-full">
        <MenuSelect placeholder="Meeting Type" attribute="meetingType" />
        <div className="hidden xl:flex gap-4">
          <MenuSelect placeholder="Group Type" attribute="subPreferences" />
          <MenuSelect placeholder="Frequency" attribute="meetingDay" />
          <MenuSelect placeholder="People" attribute="preferences" />
        </div>
      </div>
      <div className="w-full items-center gap-4 h-full hidden md:flex xl:hidden">
        <div className="w-px h-full bg-text-secondary" />
        <Button intent="secondary" className="w-full max-w-[150px]">
          All filters
        </Button>
      </div>
    </div>
  );
}
