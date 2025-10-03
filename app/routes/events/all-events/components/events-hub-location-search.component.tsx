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
  const { items } = useRefinementList({ attribute: "locations.name" });
  const { setIndexUiState, indexUiState } = useInstantSearch();

  // Get currently selected campus from Algolia state
  const selectedCampus =
    indexUiState?.refinementList?.["locations.name"]?.[0] || "";

  // Create options array with "Filter By Campus Location" as first option
  const campusOptions: DropdownOption[] = [
    { value: "", label: "Filter By Campus Location" },
    ...items.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  ];

  const handleCampusSelect = (campusValue: string) => {
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {
        ...prevState.refinementList,
        "locations.name": campusValue ? [campusValue] : [],
      },
      page: 0, // Reset to first page when filtering
    }));
  };

  return (
    <Dropdown
      options={campusOptions}
      value={selectedCampus}
      onChange={handleCampusSelect}
      placeholder={placeholder}
      className="min-w-[260px]"
      chevronColor="navy"
    />
  );
};
