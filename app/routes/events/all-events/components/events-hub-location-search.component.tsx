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
  const { items } = useRefinementList({ attribute: "campus" });
  const { setIndexUiState, indexUiState } = useInstantSearch();

  // Get currently selected campus from Algolia state
  const selectedCampus = indexUiState?.refinementList?.campus?.[0] || "";

  // Mock campus data for now (keeping Algolia logic intact)
  const mockCampusItems = [
    { value: "belle-glade", label: "Belle Glade" },
    { value: "boca-raton", label: "Boca Raton" },
    { value: "boynton-beach", label: "Boynton Beach" },
    { value: "downtown-west-palm-beach", label: "Downtown West Palm Beach" },
    { value: "en-espanol", label: "En Español" },
    { value: "jupiter", label: "Jupiter" },
    { value: "okeechobee", label: "Okeechobee" },
    { value: "online", label: "CF Everywhere (Online)" },
    { value: "palm-beach-gardens", label: "Palm Beach Gardens" },
    { value: "port-st-lucie", label: "Port St. Lucie" },
    { value: "royal-palm-beach", label: "Royal Palm Beach" },
    { value: "stuart", label: "Stuart" },
    { value: "trinity", label: "Trinity" },
    { value: "vero-beach", label: "Vero Beach" },
  ];

  // Use mock data for now, but keep the Algolia structure
  const campusItems = items.length > 0 ? items : mockCampusItems;

  // Create options array with "Filter By Campus Location" as first option
  const campusOptions: DropdownOption[] = [
    { value: "", label: "Filter By Campus Location" },
    // ...items.map((item) => ({
    ...campusItems.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  ];

  const handleCampusSelect = (campusValue: string) => {
    setIndexUiState((prevState) => ({
      ...prevState,
      refinementList: {
        ...prevState.refinementList,
        campus: campusValue ? [campusValue] : [],
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
