import { RefinementList } from "react-instantsearch";
import { CustomClearRefinements } from "~/routes/group-finder/finder/components/custom-clear-refinements.component";
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

export function GroupFilters() {
  return (
    <div className="flex flex-col w-full gap-12 bg-white col-span-1 h-fit min-w-[300px]">
      <div className="flex flex-col gap-3 text-black">
        <div className="flex justify-between">
          <h3 className="font-bold text-xl">Campus</h3>
          <CustomClearRefinements />
        </div>
        <MenuSelect
          placeholder="Select a campus..."
          attribute="campusName"
          limit={20}
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-xl">Meeting Type</h3>
        <MenuSelect
          placeholder="Select a meeting type..."
          attribute="meetingType"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-xl">Hubs</h3>
        <CustomRefinementList attribute="preferences" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-xl">Types of Groups</h3>
        <CustomRefinementList attribute="subPreferences" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-xl">Meeting Day</h3>
        <CustomRefinementList attribute="meetingDay" />
      </div>
    </div>
  );
}
