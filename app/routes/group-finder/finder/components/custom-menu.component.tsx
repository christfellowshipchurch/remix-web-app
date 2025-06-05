import { useMenu, UseMenuProps } from "react-instantsearch";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface MenuSelectProps extends UseMenuProps {
  placeholder?: string;
}

export function MenuSelect({
  placeholder = "Select a campus...",
  ...props
}: MenuSelectProps) {
  const { items, refine } = useMenu(props);
  const { value: selectedValue } = items.find((item) => item.isRefined) || {
    value: "",
  };

  return (
    <Select.Root
      value={selectedValue || undefined}
      onValueChange={(value) => refine(value)}
    >
      <Select.Trigger className="flex items-center justify-between w-full max-w-[148px] rounded-[8px] p-3 border border-[#666666] md:w-[900px] text-text-secondary font-semibold">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-white rounded-md shadow-lg border border-[#666666]"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport>
            <Select.Group>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  className="relative flex items-center px-3 py-2 rounded-sm cursor-pointer select-none hover:bg-ocean/10 focus:bg-ocean/10 focus:outline-none"
                >
                  <div className="w-4 h-4 border-2 border-ocean rounded-sm mr-2 flex items-center justify-center">
                    {item.isRefined && (
                      <div className="w-2 h-2 bg-ocean rounded-sm" />
                    )}
                  </div>
                  <Select.ItemText className="text-text-primary">
                    {item.label}
                  </Select.ItemText>
                </Select.Item>
              ))}
              <div className="flex items-center justify-center mt-4 py-2 border-t border-neutral_lighter">
                <div className="font-semibold cursor-pointer">Cancel</div>
              </div>
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
