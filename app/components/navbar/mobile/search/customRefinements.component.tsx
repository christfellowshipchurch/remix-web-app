import { RefinementList } from "react-instantsearch";

export const MobileSearchCustomRefinementList = ({
  attribute,
}: {
  attribute: string;
}) => {
  return (
    <RefinementList
      classNames={{
        list: "flex gap-2 overflow-x-auto max-w-screen pr-8 pb-2",
        checkbox: "hidden",
        count: "hidden",
        item: "flex items-center justify-center text-center text-sm font-bold text-[#7B7382] px-4 py-1 whitespace-nowrap transition-all duration-300",
        selectedItem:
          "flex items-center justify-center text-center text-sm font-bold text-white px-4 py-1 whitespace-nowrap  bg-navy rounded-[55px] transition-all duration-300",
        label:
          "flex items-center justify-center w-full max-w-80 gap-2 py-2 cursor-pointer",
      }}
      attribute={attribute}
    />
  );
};
