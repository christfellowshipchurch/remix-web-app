import { useInstantSearch, useRefinementList } from "react-instantsearch";
import Dropdown, {
  type DropdownOption,
} from "~/primitives/inputs/dropdown/dropdown.primitive";

interface EventsHubLocationSearchProps {
  placeholder?: string;
}

export const EventsHubLocationSearch = ({
  placeholder = "Select Campus",
}: EventsHubLocationSearchProps) => {
  const { items } = useRefinementList({ attribute: "eventLocations" });
  const { setIndexUiState, indexUiState } = useInstantSearch();

  const selectedLocation =
    indexUiState?.refinementList?.eventLocations?.[0] || "";

  const locationOptions: DropdownOption[] = [
    { value: "", label: "Filter By Campus Location" },
    ...items.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  ];

  const handleLocationSelect = (locationValue: string) => {
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {
        ...prevState.refinementList,
        eventLocations: locationValue ? [locationValue] : [],
      },
      page: 0,
    }));
  };

  return (
    <Dropdown
      options={locationOptions}
      value={selectedLocation}
      onChange={handleLocationSelect}
      placeholder={placeholder}
      className="min-w-[260px]"
      chevronColor="navy"
    />
  );
};
