import { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { GroupsFinderDropdwnPopup } from "~/routes/group-finder/components/filters/groups-finder-dropdown-popup.component";

export function UpcomingSessionFilters({
  coordinates,
  setCoordinates,
}: {
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  setCoordinates: (
    coordinates: {
      lat: number | null;
      lng: number | null;
    } | null
  ) => void;
}) {
  const [showGroupType, setShowGroupType] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const onHide = () => {
    setShowGroupType(false);
    setShowFrequency(false);
    setShowLocation(false);
  };

  const handleToggle = (
    setter: (value: boolean) => void,
    currentValue: boolean
  ) => {
    onHide();
    setter(!currentValue);
  };

  return (
    <FilterContainer>
      {/* Location */}
      <FilterDropdown
        title="Location"
        isOpen={showLocation}
        onToggle={() => handleToggle(setShowLocation, showLocation)}
        onHide={onHide}
        data={{
          content: [
            {
              title: "Christ Fellowship Campus",
              attribute: "campus.name",
            },
            {
              title: "Find closest to...",
              attribute: "campus",
              isLocation: true,
              coordinates: coordinates,
              setCoordinates: setCoordinates,
            },
          ],
        }}
        maxWidth={210}
        refinementClassName="-left-[160px] md:-left-[170px] lg:left-auto"
      />

      {/* Learning Format */}
      <FilterDropdown
        title="Learning Format"
        isOpen={showGroupType}
        onToggle={() => handleToggle(setShowGroupType, showGroupType)}
        onHide={onHide}
        data={{
          content: [
            { attribute: "format", isMeetingType: true, showFooter: true },
          ],
        }}
        maxWidth={210}
        refinementClassName="md:-left-[170px] lg:left-auto"
      />

      {/* Languages */}
      <FilterDropdown
        title="Languages"
        isOpen={showFrequency}
        onToggle={() => handleToggle(setShowFrequency, showFrequency)}
        onHide={onHide}
        data={{
          content: [
            {
              attribute: "language",
              showFooter: true,
            },
          ],
        }}
        maxWidth={210}
        refinementClassName="md:-left-[170px] lg:left-auto"
      />
    </FilterContainer>
  );
}

export function FilterContainer({ children }: { children: ReactNode }) {
  return (
    <div className="relative md:static flex gap-4 w-full bg-white col-span-1 h-full md:min-w-[300px] items-center overflow-x-auto md:overflow-x-visible scrollbar-hide">
      <div className="w-full md:w-fit flex gap-4 min-w-max md:min-w-0">
        {children}
      </div>
    </div>
  );
}

interface FilterDropdownProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onHide: () => void;
  data: {
    content: Array<{
      title?: string;
      attribute: string;
      isMeetingType?: boolean;
      isLocation?: boolean;
      checkbox?: boolean;
      showFooter?: boolean;
      coordinates?: {
        lat: number | null;
        lng: number | null;
      } | null;
      setCoordinates?: (
        coordinates: {
          lat: number | null;
          lng: number | null;
        } | null
      ) => void;
    }>;
  };
  maxWidth?: number;
  refinementClassName?: string;
}

export function FilterDropdown({
  title,
  isOpen,
  onToggle,
  onHide,
  data,
  maxWidth = 210,
  refinementClassName,
}: FilterDropdownProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      ref={buttonRef}
      className={cn(
        "relative",
        "flex items-center justify-between",
        "w-fit",
        "rounded-[8px]",
        "p-3",
        "border border-[#666666]",
        "text-text-secondary",
        "font-semibold",
        "cursor-pointer",
        "flex-shrink-0"
      )}
      style={{ maxWidth: maxWidth }}
      onClick={onToggle}
    >
      <p>{title}</p>
      <Icon name="chevronDown" />

      <GroupsFinderDropdwnPopup
        popupTitle={title}
        data={data}
        onHide={onHide}
        showSection={isOpen}
        className={cn(
          "w-fit md:w-[330px]",
          "absolute left-0 right-0 md:right-1/2 md:translate-x-1/2",
          "top-0 md:top-[65px]",
          "z-50",
          refinementClassName
        )}
        style={isMobile && isOpen ? { top: `65px` } : undefined}
      />
    </div>
  );
}
