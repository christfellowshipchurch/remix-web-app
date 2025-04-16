import { RefinementList } from "react-instantsearch";

export const SearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  return (
    <RefinementList
      classNames={{
        list: "flex flex-wrap gap-2",
        checkbox: "hidden",
        count: "hidden",
        item: "flex items-center justify-center text-center text-xs border-[#AAAAAA] text-[#444444] border-[0.7px] px-4 py-2 whitespace-nowrap rounded-md hover:text-ocean hover:border-ocean transition-all duration-300",
        selectedItem:
          "text-ocean border-ocean overflow-hidden group pr-3 hover:-translate-y-1",
        label:
          "flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer group-[.ais-RefinementList-item--selected]:pr-5 group-[.ais-RefinementList-item--selected]:bg-[url('/assets/icons/xmark-solid.svg')] group-[.ais-RefinementList-item--selected]:bg-[length:16px_16px] group-[.ais-RefinementList-item--selected]:bg-[center_right_0px] group-[.ais-RefinementList-item--selected]:bg-no-repeat",
      }}
      attribute={attribute}
    />
  );
};
