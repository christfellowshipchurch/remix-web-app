import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, useRouteLoaderData } from "react-router-dom";
import { InstantSearch, Configure, useHits } from "react-instantsearch";
import { createSearchClient } from "~/lib/create-search-client";
import Icon from "~/primitives/icon";
import { RockProxyEmbed } from "~/components/rock-embed";
import { EventFinderHit } from "../types";
import { RootLoaderData } from "~/routes/navbar/loader";
import { ClickableCard } from "./clickable-card.component";
import { RockCampuses } from "~/lib/rock-config";
import {
  getSubGroupTypeDescription,
  getPageIdForGroupType,
  hasSubGroupTypes,
} from "../registration.data";

interface ClickThroughRegistrationProps {
  title: string;
  groupType?: string;
}

export const ClickThroughRegistration = ({
  title,
  groupType,
}: ClickThroughRegistrationProps) => {
  const location = useLocation();
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const algolia = rootData?.algolia ?? {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
  };

  // Extract groupType from URL if not provided as prop
  // URL format: /events/kids-dedication or /events/baptism
  const pathParts = location.pathname.split("/");
  const lastPart = pathParts[pathParts.length - 1] || "";
  const extractedGroupType =
    groupType ||
    (lastPart
      ? lastPart
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "");

  // Normalize groupType to handle variations
  const normalizedGroupType = extractedGroupType
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const hasSubGroups = hasSubGroupTypes(normalizedGroupType);
  const totalSteps = hasSubGroups ? 5 : 4;

  // Map display step to actual step
  // For groupTypes without subGroupTypes: 1->1, 2->3, 3->4, 4->5
  const getActualStep = (displayStep: number): number => {
    if (hasSubGroups) return displayStep;
    if (displayStep === 1) return 1;
    return displayStep + 1;
  };

  // Map actual step to display step
  // For groupTypes without subGroupTypes: 1->1, 3->2, 4->3, 5->4
  const getDisplayStep = (actualStep: number): number => {
    if (hasSubGroups) return actualStep;
    if (actualStep === 1) return 1;
    return actualStep - 1;
  };

  const [step, setStep] = useState(1);
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [selectedSubGroupType, setSelectedSubGroupType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [campusSearchQuery, setCampusSearchQuery] = useState<string>("");
  const [isGoingBack, setIsGoingBack] = useState(false);
  const previousStepRef = useRef<number>(1);

  const searchClient = useMemo(
    () =>
      createSearchClient(
        algolia.ALGOLIA_APP_ID || "",
        algolia.ALGOLIA_SEARCH_API_KEY || ""
      ),
    [algolia.ALGOLIA_APP_ID, algolia.ALGOLIA_SEARCH_API_KEY]
  );

  const handleBack = () => {
    if (step > 1) {
      // Set flag to disable auto-select (will be reset when user makes a selection)
      setIsGoingBack(true);
      previousStepRef.current = step;
      // Clear selections when going back based on current step
      if (step === 5) {
        setSelectedTime("");
      } else if (step === 4) {
        setSelectedDate("");
      } else if (step === 3) {
        if (hasSubGroups) {
          setSelectedSubGroupType("");
        } else {
          setSelectedDate("");
        }
      } else if (step === 2) {
        if (hasSubGroups) {
          setSelectedCampus("");
        } else {
          setSelectedCampus("");
        }
      }
      setStep(step - 1);
    }
  };

  const navigateToStep = (targetDisplayStep: number) => {
    // Set flag to disable auto-select (will be reset when user makes a selection)
    setIsGoingBack(true);
    previousStepRef.current = step;
    const targetActualStep = getActualStep(targetDisplayStep);
    // Clear selections for steps after the target step
    if (targetActualStep < 5) {
      setSelectedTime("");
    }
    if (targetActualStep < 4) {
      setSelectedDate("");
    }
    if (targetActualStep < 3) {
      setSelectedSubGroupType("");
    }
    if (targetActualStep < 2) {
      setSelectedCampus("");
    }
    setStep(targetActualStep);
  };

  const getStepsData = () => {
    if (hasSubGroups) {
      return [
        { step: 1, title: "Choose Your Campus" },
        { step: 2, title: "Select the Event Type" },
        { step: 3, title: "Select the Date" },
        { step: 4, title: "Pick Your Time" },
        { step: 5, title: "Personal Information" },
      ];
    }
    return [
      { step: 1, title: "Choose Your Campus" },
      { step: 2, title: "Select the Date" },
      { step: 3, title: "Pick Your Time" },
      { step: 4, title: "Personal Information" },
    ];
  };

  const getCurrentStepData = () => {
    const displayStep = getDisplayStep(step);
    const stepsData = getStepsData();
    return stepsData.find((data) => data.step === displayStep) || stepsData[0];
  };

  const buildFilter = () => {
    if (!normalizedGroupType) return "";
    let filter = `groupType:"${normalizedGroupType}"`;
    if (selectedCampus) {
      filter += ` AND campus.name:"${selectedCampus.trim()}"`;
    }
    if (selectedSubGroupType && hasSubGroups) {
      filter += ` AND subGroupType:"${selectedSubGroupType.trim()}"`;
    }
    if (selectedDate) {
      // Ensure date format matches exactly (YYYY-MM-DD)
      const trimmedDate = selectedDate.trim();
      filter += ` AND date:"${trimmedDate}"`;
    }
    return filter;
  };

  return (
    <InstantSearch
      indexName="dev_EventFinderItems"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure
        filters={buildFilter()}
        hitsPerPage={1000}
        query={step === 1 && campusSearchQuery ? campusSearchQuery : ""}
        restrictSearchableAttributes={
          step === 1 && campusSearchQuery
            ? ["campus.name", "campus.city"]
            : undefined
        }
      />

      <section
        className="flex items-center w-full py-8 md:py-16 content-padding bg-gray"
        id="register"
      >
        <div className="w-full max-w-3xl flex flex-col gap-13 mx-auto">
          <div className="flex flex-col gap-4">
            <h2 className="font-extrabold text-center text-black text-[32px]">
              Register for {title}
            </h2>
            <p className="text-center text-[#717182] text-lg font-medium md:mx-4">
              Ready to take the next step? Complete our {totalSteps}-step
              registration process to secure your spot.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Top */}
            <div className="flex flex-col gap-2 items-center">
              <div className="flex gap-4 items-center">
                {step > 1 && (
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={handleBack}
                  >
                    <Icon name="chevronLeft" size={16} className="text-black" />
                    <p className="text-xs font-semibold text-[#616161]">Back</p>
                  </div>
                )}
                <h3 className="text-xl font-bold text-black">
                  {getCurrentStepData().title}
                </h3>
              </div>

              <div className="flex gap-2 items-center">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                  (dotStep) => {
                    const displayStep = getDisplayStep(step);
                    return (
                      <div
                        key={dotStep}
                        className={`${
                          dotStep <= displayStep ? "bg-ocean" : "bg-[#AEAEAE]"
                        } size-[10px] rounded-full`}
                      />
                    );
                  }
                )}
              </div>

              <p className="text-black font-semibold text-sm mb-4">
                Step {getDisplayStep(step)} of {totalSteps}
              </p>
            </div>

            {/* Selected Bar - shows previous selections */}
            {(selectedCampus ||
              selectedSubGroupType ||
              selectedDate ||
              selectedTime) && (
              <div className="flex gap-4 items-center justify-center flex-wrap mb-4">
                {selectedCampus && (
                  <SelectedBar
                    icon="map"
                    text={selectedCampus}
                    onClick={() => navigateToStep(1)}
                  />
                )}
                {selectedSubGroupType && hasSubGroups && (
                  <SelectedBar
                    icon="group"
                    text={selectedSubGroupType}
                    onClick={() => navigateToStep(2)}
                  />
                )}
                {selectedDate && (
                  <SelectedBar
                    icon="calendarAlt"
                    text={formatDateDisplay(selectedDate)}
                    onClick={() => navigateToStep(hasSubGroups ? 3 : 2)}
                  />
                )}
                {selectedTime && (
                  <SelectedBar
                    icon="timeFive"
                    text={`${selectedTime} ET`}
                    onClick={() => navigateToStep(hasSubGroups ? 4 : 3)}
                  />
                )}
              </div>
            )}

            {/* Step Content */}
            <StepContent
              step={step}
              selectedCampus={selectedCampus}
              selectedSubGroupType={selectedSubGroupType}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              campusSearchQuery={campusSearchQuery}
              isGoingBack={isGoingBack}
              groupType={extractedGroupType}
              onCampusSelect={(campus) => {
                setSelectedCampus(campus);
                setIsGoingBack(false);
                previousStepRef.current = 1;
                setStep(hasSubGroups ? 2 : 3);
              }}
              onSubGroupTypeSelect={(subGroupType) => {
                setSelectedSubGroupType(subGroupType);
                setIsGoingBack(false);
                previousStepRef.current = 2;
                setStep(3);
              }}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setIsGoingBack(false);
                previousStepRef.current = hasSubGroups ? 3 : 3;
                setStep(4);
              }}
              onTimeSelect={(time) => {
                setSelectedTime(time);
                setIsGoingBack(false);
                previousStepRef.current = hasSubGroups ? 4 : 3;
                setStep(5);
              }}
              hasSubGroups={hasSubGroups}
              onCampusSearchChange={setCampusSearchQuery}
            />
          </div>
        </div>
      </section>
    </InstantSearch>
  );
};

// SelectedBar Component
const SelectedBar = ({
  icon,
  text,
  onClick,
}: {
  icon: "map" | "group" | "calendarAlt" | "timeFive";
  text: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex gap-2 items-center bg-white rounded-lg border border-neutral-lighter px-3 py-1 ${
        onClick ? "cursor-pointer hover:border-ocean transition-colors" : ""
      }`}
    >
      <Icon name={icon} size={16} className="text-black" />
      <p className="text-sm text-black font-medium">{text}</p>
    </div>
  );
};

// Step Content Component
interface StepContentProps {
  step: number;
  selectedCampus: string;
  selectedSubGroupType: string;
  selectedDate: string;
  selectedTime: string;
  campusSearchQuery: string;
  isGoingBack: boolean;
  groupType: string;
  hasSubGroups: boolean;
  onCampusSelect: (campus: string) => void;
  onSubGroupTypeSelect: (subGroupType: string) => void;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onCampusSearchChange: (query: string) => void;
}

const StepContent = ({
  step,
  selectedCampus,
  selectedSubGroupType,
  selectedDate,
  selectedTime,
  campusSearchQuery,
  isGoingBack,
  groupType,
  hasSubGroups,
  onCampusSelect,
  onSubGroupTypeSelect,
  onDateSelect,
  onTimeSelect,
  onCampusSearchChange,
}: StepContentProps) => {
  const { items } = useHits<EventFinderHit>();
  const stepRef = useRef(step);
  const wasGoingBackRef = useRef(false);

  // Track if we're going back by comparing current step to previous step
  useEffect(() => {
    if (step < stepRef.current) {
      // Going backward - set flag
      wasGoingBackRef.current = true;
    } else if (step > stepRef.current) {
      // Going forward - clear flag
      wasGoingBackRef.current = false;
    }
    stepRef.current = step;
  }, [step]);

  // Handle case where no hits are available
  if (items.length === 0 && step !== 5) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-600">
          No events found. Please check your selections and try again.
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <CampusStep
        hits={items}
        onSelect={onCampusSelect}
        searchQuery={campusSearchQuery}
        onSearchChange={onCampusSearchChange}
        isGoingBack={isGoingBack || wasGoingBackRef.current}
      />
    );
  }

  if (step === 2 && hasSubGroups) {
    return (
      <SubGroupTypeStep
        hits={items}
        selectedCampus={selectedCampus}
        groupType={groupType}
        onSelect={onSubGroupTypeSelect}
        isGoingBack={isGoingBack || wasGoingBackRef.current}
      />
    );
  }

  if (step === 3 || (step === 2 && !hasSubGroups)) {
    return (
      <DateStep
        hits={items}
        selectedCampus={selectedCampus}
        selectedSubGroupType={selectedSubGroupType}
        hasSubGroups={hasSubGroups}
        onSelect={onDateSelect}
        isGoingBack={isGoingBack || wasGoingBackRef.current}
      />
    );
  }

  if (step === 4) {
    return (
      <TimeStep
        hits={items}
        selectedCampus={selectedCampus}
        selectedSubGroupType={selectedSubGroupType}
        selectedDate={selectedDate}
        hasSubGroups={hasSubGroups}
        onSelect={onTimeSelect}
        isGoingBack={isGoingBack || wasGoingBackRef.current}
      />
    );
  }

  if (step === 5) {
    const matchingHit = items.find((hit) => {
      const campusMatch =
        hit.campus &&
        hit.campus.name &&
        hit.campus.name === selectedCampus &&
        hit.time === selectedTime &&
        hit.date === selectedDate;
      if (hasSubGroups) {
        return campusMatch && hit.subGroupType === selectedSubGroupType;
      }
      return campusMatch;
    });
    return (
      <FormStep
        groupGuid={matchingHit?.groupGuid || ""}
        groupType={groupType}
        selectedCampus={selectedCampus}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    );
  }

  return null;
};

// Campus Step Component
interface CampusStepProps {
  hits: EventFinderHit[];
  onSelect: (campus: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isGoingBack: boolean;
}

const CampusStep = ({
  hits,
  onSelect,
  searchQuery,
  onSearchChange,
  isGoingBack,
}: CampusStepProps) => {
  // Get unique campuses
  const uniqueCampuses = useMemo(() => {
    const campusMap = new Map<
      string,
      { name: string; location?: string; city?: string }
    >();
    hits
      .filter((hit) => hit.campus && hit.campus.name)
      .forEach((hit) => {
        if (!campusMap.has(hit.campus.name)) {
          campusMap.set(hit.campus.name, {
            name: hit.campus.name,
            location: hit.campus.street1 || undefined, //matching design format for now
            city: hit.campus.city || undefined,
          });
        }
      });

    // Sort campuses based on the order in RockCampuses
    const campuses = Array.from(campusMap.values());
    const campusOrderMap = new Map<string, number>(
      RockCampuses.map((campus, index) => [campus.name, index])
    );

    return campuses.sort((a, b) => {
      const orderA = campusOrderMap.get(a.name) ?? Infinity;
      const orderB = campusOrderMap.get(b.name) ?? Infinity;
      return orderA - orderB;
    });
  }, [hits]);

  // Filter campuses by search query
  const filteredCampuses = useMemo(() => {
    if (!searchQuery) return uniqueCampuses;
    const query = searchQuery.toLowerCase();
    return uniqueCampuses.filter(
      (campus) =>
        campus.name.toLowerCase().includes(query) ||
        campus.location?.toLowerCase().includes(query) ||
        campus.city?.toLowerCase().includes(query)
    );
  }, [uniqueCampuses, searchQuery]);

  // Auto-select if only one option (only when not searching and not going back)
  useEffect(() => {
    if (!isGoingBack && !searchQuery && filteredCampuses.length === 1) {
      onSelect(filteredCampuses[0].name);
    }
  }, [filteredCampuses, searchQuery, onSelect, isGoingBack]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative w-full max-w-[400px] mx-auto mb-4">
        <Icon
          name="search"
          size={18}
          className="absolute left-3 top-[45%] -translate-y-1/2 text-black"
        />
        <input
          type="text"
          placeholder="Search campuses by name or city..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ocean"
        />
      </div>

      {/* Campus Cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {filteredCampuses.map((campus) => (
          <ClickableCard
            key={campus.name}
            variant="campus"
            icon="map"
            title={campus.name}
            subtitle={campus.location || ""}
            onClick={() => onSelect(campus.name)}
          />
        ))}
      </div>
    </div>
  );
};

// SubGroupType Step Component
interface SubGroupTypeStepProps {
  hits: EventFinderHit[];
  selectedCampus: string;
  groupType: string;
  onSelect: (subGroupType: string) => void;
  isGoingBack: boolean;
}

const SubGroupTypeStep = ({
  hits,
  selectedCampus,
  groupType,
  onSelect,
  isGoingBack,
}: SubGroupTypeStepProps) => {
  // Get unique subGroupTypes for selected campus
  const uniqueSubGroupTypes = useMemo(() => {
    const subGroupTypeMap = new Map<string, string>();
    hits
      .filter(
        (hit) =>
          hit.campus &&
          hit.campus.name &&
          hit.campus.name.trim() === selectedCampus.trim()
      )
      .forEach((hit) => {
        if (hit.subGroupType && !subGroupTypeMap.has(hit.subGroupType)) {
          subGroupTypeMap.set(hit.subGroupType, hit.subGroupType);
        }
      });
    return Array.from(subGroupTypeMap.values()).sort();
  }, [hits, selectedCampus]);

  // Auto-select if only one option (only when not going back)
  useEffect(() => {
    if (!isGoingBack && uniqueSubGroupTypes.length === 1) {
      onSelect(uniqueSubGroupTypes[0]);
    }
  }, [uniqueSubGroupTypes, onSelect, isGoingBack]);

  if (uniqueSubGroupTypes.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-600">
          No event types available for the selected campus. Please go back and
          select a different campus.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {uniqueSubGroupTypes.map((subGroupType) => {
        return (
          <ClickableCard
            key={subGroupType}
            variant="eventType"
            icon={"group"}
            title={subGroupType}
            subtitle={groupType}
            description={getSubGroupTypeDescription(subGroupType)}
            buttonText={`Select ${groupType} Event`}
            onClick={() => onSelect(subGroupType)}
          />
        );
      })}
    </div>
  );
};

// Date Step Component
interface DateStepProps {
  hits: EventFinderHit[];
  selectedCampus: string;
  selectedSubGroupType: string;
  hasSubGroups: boolean;
  onSelect: (date: string) => void;
  isGoingBack: boolean;
}

const DateStep = ({
  hits,
  selectedCampus,
  selectedSubGroupType,
  hasSubGroups,
  onSelect,
  isGoingBack,
}: DateStepProps) => {
  // Get unique dates for selected campus and subGroupType (if applicable)
  const uniqueDates = useMemo(() => {
    const dateMap = new Map<string, { date: string; day: string }>();
    hits
      .filter((hit) => {
        const campusMatch =
          hit.campus &&
          hit.campus.name &&
          hit.campus.name.trim() === selectedCampus.trim();
        if (hasSubGroups) {
          return (
            campusMatch &&
            hit.subGroupType &&
            hit.subGroupType.trim() === selectedSubGroupType.trim()
          );
        }
        return campusMatch;
      })
      .forEach((hit) => {
        if (!dateMap.has(hit.date)) {
          dateMap.set(hit.date, {
            date: hit.date,
            day: hit.day,
          });
        }
      });
    return Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [hits, selectedCampus, selectedSubGroupType, hasSubGroups]);

  // Auto-select if only one option (only when not going back)
  useEffect(() => {
    if (!isGoingBack && uniqueDates.length === 1) {
      onSelect(uniqueDates[0].date);
    }
  }, [uniqueDates, onSelect, isGoingBack]);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {uniqueDates.map((dateInfo) => (
        <ClickableCard
          key={dateInfo.date}
          variant="date"
          icon="calendarAlt"
          title={formatDateDisplay(dateInfo.date, dateInfo.day)}
          subtitle={dateInfo.day}
          onClick={() => onSelect(dateInfo.date)}
        />
      ))}
    </div>
  );
};

// Time Step Component
interface TimeStepProps {
  hits: EventFinderHit[];
  selectedCampus: string;
  selectedSubGroupType: string;
  selectedDate: string;
  hasSubGroups: boolean;
  onSelect: (time: string) => void;
  isGoingBack: boolean;
}

const TimeStep = ({
  hits,
  selectedCampus,
  selectedSubGroupType,
  selectedDate,
  hasSubGroups,
  onSelect,
  isGoingBack,
}: TimeStepProps) => {
  // Get unique times for selected campus, subGroupType (if applicable), and date
  const uniqueTimes = useMemo(() => {
    const timeMap = new Map<string, { time: string; groupGuid: string }>();

    // Filter hits that match campus, subGroupType (if applicable), and date exactly
    // Trim values to handle any whitespace issues
    const matchingHits = hits.filter((hit) => {
      const campusMatch =
        hit.campus &&
        hit.campus.name &&
        hit.campus.name.trim() === selectedCampus.trim();
      const dateMatch = hit.date && hit.date.trim() === selectedDate.trim();
      if (hasSubGroups) {
        return (
          campusMatch &&
          dateMatch &&
          hit.subGroupType &&
          hit.subGroupType.trim() === selectedSubGroupType.trim()
        );
      }
      return campusMatch && dateMatch;
    });

    matchingHits.forEach((hit) => {
      if (!timeMap.has(hit.time)) {
        timeMap.set(hit.time, {
          time: hit.time,
          groupGuid: hit.groupGuid,
        });
      }
    });

    return Array.from(timeMap.values());
  }, [hits, selectedCampus, selectedSubGroupType, selectedDate, hasSubGroups]);

  // Auto-select if only one option (only when not going back)
  useEffect(() => {
    if (!isGoingBack && uniqueTimes.length === 1) {
      onSelect(uniqueTimes[0].time);
    }
  }, [uniqueTimes, onSelect, isGoingBack]);

  if (uniqueTimes.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-600">
          No times available for the selected date. Please go back and select a
          different date.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {uniqueTimes.map((timeInfo) => (
        <ClickableCard
          key={timeInfo.time}
          variant="time"
          icon="timeFive"
          title={timeInfo.time}
          subtitle="Eastern Time"
          onClick={() => onSelect(timeInfo.time)}
        />
      ))}
    </div>
  );
};

// Form Step Component
interface FormStepProps {
  groupGuid: string;
  groupType: string;
  selectedCampus: string;
  selectedDate: string;
  selectedTime: string;
}

const FormStep = ({
  groupGuid,
  groupType,
  selectedCampus: _selectedCampus,
  selectedDate: _selectedDate,
  selectedTime: _selectedTime,
}: FormStepProps) => {
  const pageId = getPageIdForGroupType(groupType);
  const rockEmbedUrl = `https://rock.gocf.org/page/${pageId}?Group=${groupGuid}`;

  if (!groupGuid) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-600">
          Unable to load registration form. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto rounded-xl overflow-hidden">
      <RockProxyEmbed
        url={rockEmbedUrl}
        height={1000}
        showLoading={true}
        useAdvancedProxy={true}
        className="w-full"
      />
    </div>
  );
};

// Helper Functions
const formatDateDisplay = (dateString: string, dayName?: string): string => {
  // Parse date string manually to avoid timezone issues
  // Date format is YYYY-MM-DD
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  const dayNum = date.getDate();
  const suffix = getDaySuffix(dayNum);

  // Use provided dayName if available, otherwise calculate it
  const weekday =
    dayName || date.toLocaleDateString("en-US", { weekday: "short" });

  return `${weekday} ${monthName} ${dayNum}${suffix}`;
};

const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
