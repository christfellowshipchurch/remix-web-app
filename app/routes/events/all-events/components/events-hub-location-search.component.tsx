import { useInstantSearch, useRefinementList } from "react-instantsearch";
import Dropdown, {
  type DropdownOption,
} from "~/primitives/inputs/dropdown/dropdown.primitive";
import { cn } from "~/lib/utils";

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

  const hasCampusFilter = Boolean(selectedLocation);

  return (
    <Dropdown
      options={locationOptions}
      value={selectedLocation}
      onChange={handleLocationSelect}
      placeholder={placeholder}
      className="min-w-[260px]"
      triggerIcon="map"
      triggerIconClassName={cn(
        "transition-colors duration-300",
        hasCampusFilter ? "text-ocean" : "text-neutral-default",
      )}
      triggerClassName={cn(
        "md:rounded-lg md:px-4 md:py-2.5 md:text-sm md:font-semibold md:shadow-none md:transition-all md:duration-300",
        hasCampusFilter
          ? "md:border-ocean md:bg-ocean/10 md:text-ocean md:hover:border-ocean"
          : "md:border-[#DEE0E3] md:text-neutral-default md:hover:border-neutral-default",
      )}
      openTriggerClassName={
        hasCampusFilter
          ? undefined
          : "md:border-ocean md:bg-ocean/10 md:text-ocean md:hover:border-ocean"
      }
      menuClassName="md:border-[#909090] md:shadow-md"
      chevronColor={hasCampusFilter ? "text-ocean" : "text-neutral-default"}
      chevronReflectsOpenState
    />
  );
};
