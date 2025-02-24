import { useMenu, UseMenuProps } from "react-instantsearch";

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
    <select
      className="w-full px-2 py-1 border-2 border-[#D0D0CE] rounded-md focus:outline-none"
      style={{
        appearance: "none",
        background:
          "url('/assets/icons/chevron-down.svg') no-repeat right 0.5rem center/1.5rem",
      }}
      value={selectedValue}
      onChange={(event) => {
        refine((event.target as HTMLSelectElement).value);
      }}
    >
      <option value="">{placeholder}</option>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
