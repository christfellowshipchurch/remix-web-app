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
      className="w-full p-2 border-2 border-[#D0D0CE] rounded-md"
      style={{
        appearance: "none",
        background:
          "url(../app/assets/icons/groups/chevron-down.svg) no-repeat right 0.5rem center/1.5rem",
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
