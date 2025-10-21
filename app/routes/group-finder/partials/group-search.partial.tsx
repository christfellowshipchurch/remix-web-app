import { useLoaderData } from "react-router-dom";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  Stats,
} from "react-instantsearch";

import { DesktopGroupFilters } from "../components/popups/group-filters";

import Icon from "~/primitives/icon";
import { useResponsive } from "~/hooks/use-responsive";

import { FindersCustomPagination } from "../components/finders-custom-pagination.component";
import { LoaderReturnType } from "../loader";
import { GroupHit } from "../components/group-hit.component";
import { useEffect, useState } from "react";
import { AllFiltersPopup } from "../components/popups/all-filters.component";
import { Button } from "~/primitives/button/button.primitive";
import { cn } from "~/lib/utils";
import { GroupType } from "../types";

export const GroupSearch = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  } | null>(null);
  const [ageInput, setAgeInput] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll handling effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;
      const scrollDelta = currentScrollY - lastScrollY;

      // Reset at top of page
      if (currentScrollY < scrollThreshold) {
        setLastScrollY(currentScrollY);
        return;
      }

      // Handle scroll direction
      if (Math.abs(scrollDelta) > scrollThreshold) {
        // When scrolling up (negative delta), navbar is showing
        if (scrollDelta < 0) {
          setIsNavbarOpen(true);
        } else {
          // When scrolling down, navbar is hidden
          setIsNavbarOpen(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const searchClient = algoliasearch(
    ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY,
    {}
  );

  return (
    <div
      className="flex flex-col gap-4 w-full pt-12 pagination-scroll-to"
      id="search"
    >
      <InstantSearch
        indexName="dev_daniel_Groups"
        searchClient={searchClient}
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        <ResponsiveConfigure
          selectedLocation={null}
          ageInput={ageInput}
          coordinates={coordinates}
        />
        <div className="flex flex-col">
          {/* Filters Section */}
          <div
            className={cn(
              "sticky bg-white z-2 content-padding shadow-sm select-none transition-all duration-300",
              isNavbarOpen ? "top-18 md:top-22" : "top-0"
            )}
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 lg:gap-4 xl:gap-8 py-4 max-w-screen-content mx-auto h-20">
              {/* Group Search Box */}
              <div className="w-full md:w-[240px] lg:w-[250px] xl:w-[266px] flex items-center rounded-[8px] bg-[#EDF3F8] focus-within:border-ocean py-2">
                <Icon name="searchAlt" className="text-[#666666] ml-3" />
                <SearchBox
                  placeholder="Keyword"
                  translations={{
                    submitButtonTitle: "Search",
                    resetButtonTitle: "Reset",
                  }}
                  classNames={{
                    root: "flex-grow",
                    form: "flex",
                    input: "w-full text-xl px-2 focus:outline-none",
                    resetIcon: "hidden",
                    submit: "hidden",
                    loadingIcon: "hidden",
                  }}
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:block">
                <DesktopGroupFilters
                  coordinates={coordinates}
                  setCoordinates={setCoordinates}
                  ageInput={ageInput}
                  setAgeInput={setAgeInput}
                />
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden bg-white pb-4 border-b-2 border-black/10 border-solid select-none">
            <div className="content-padding">
              <Button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                intent="secondary"
                className="flex items-center gap-2 border-2 px-8 w-full text-text-primary rounded-[8px]"
              >
                <Icon name="sliderAlt" className="text-navy" />
                All Filters
              </Button>
            </div>
            <div
              className={cn(
                "absolute transition-all duration-300 w-full",
                isMobileOpen
                  ? "z-4 opacity-100 top-[calc(100%_+_24px)]"
                  : "-z-1 opacity-0"
              )}
            >
              <AllFiltersPopup onHide={() => setIsMobileOpen(false)} />
            </div>
          </div>

          {/* Group Search Results & Pagination */}
          <div className="flex flex-col bg-gray py-8 md:pt-12 md:pb-20 w-full content-padding">
            <div className="max-w-screen-content mx-auto md:w-full">
              <Stats
                classNames={{
                  root: "text-text-secondary mb-6",
                }}
                translations={{
                  rootElementText: ({ nbHits }) =>
                    `${nbHits.toLocaleString()} Results Found`,
                }}
              />

              <Hits
                classNames={{
                  root: "flex items-center justify-center md:items-start md:justify-start w-full",
                  item: "flex items-center justify-center md:items-start md:justify-start w-full",
                  list: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-8 lg:gap-x-4 xl:!gap-x-8 gap-y-6 md:gap-y-8 lg:gap-y-16 w-full max-w-[900px] lg:max-w-[1296px]",
                }}
                hitComponent={({ hit }: { hit: GroupType }) => {
                  return <GroupHit hit={hit} />;
                }}
              />
              <div className="mt-6 flex justify-center md:justify-start">
                <FindersCustomPagination />
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};

export const ResponsiveConfigure = ({
  selectedLocation,
  ageInput,
  coordinates,
}: {
  selectedLocation: string | null;
  ageInput: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
}) => {
  const { isSmall, isMedium, isLarge, isXLarge } = useResponsive();

  const hitsPerPage = (() => {
    switch (true) {
      case isXLarge || isLarge:
        return 12;
      case isMedium:
        return 9;
      case isSmall:
        return 5;
      default:
        return 5;
    }
  })();

  // Build filters array
  const filters = [];
  if (selectedLocation) {
    filters.push(`campusName:'${selectedLocation}'`);
  }
  if (ageInput) {
    const userAge = parseInt(ageInput);
    if (!isNaN(userAge)) {
      // Filter groups where user's age falls within the group's age range
      filters.push(`minAge <= ${userAge} AND maxAge >= ${userAge}`);
    }
  }

  return (
    <Configure
      key={`${coordinates?.lat}-${coordinates?.lng}-${selectedLocation}-${ageInput}`}
      hitsPerPage={hitsPerPage}
      filters={filters.length > 0 ? filters.join(" AND ") : undefined}
      aroundLatLng={
        coordinates?.lat && coordinates?.lng
          ? `${coordinates.lat}, ${coordinates.lng}`
          : undefined
      }
      aroundRadius="all"
      aroundLatLngViaIP={false}
      getRankingInfo={true}
    />
  );
};
