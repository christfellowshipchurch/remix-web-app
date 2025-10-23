import React, { useRef, useEffect, useState } from "react";
import { Stats, useRefinementList } from "react-instantsearch";
import { FinderLocationSearch } from "~/components/finders-location-search/location-search.component";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";

export const GroupsFinderDropdwnPopup = ({
  popupTitle,
  className,
  data,
  showSection,
  onHide,
  ageInput,
  setAgeInput,
}: {
  popupTitle: string;
  className?: string;
  data: {
    content: {
      title?: string;
      attribute: string;
      input?: boolean;
      inputPlaceholder?: string;
      checkbox?: boolean;
      checkboxLayout?: "vertical" | "horizontal";
      isAgeRange?: boolean;
      isLocation?: boolean;
      isMeetingType?: boolean;
      isMeetingDays?: boolean;
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
    }[];
  };
  showSection: boolean;
  onHide: () => void;
  ageInput?: string;
  setAgeInput?: (age: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "cursor-default absolute top-[65px] right-1/2 translate-x-1/2 z-4",
        className,
        "w-[330px] xl:w-[380px] flex flex-col gap-4 bg-white",
        "rounded-[1rem] border border-neutral-lighter overflow-hidden",
        showSection ? "z-4 opacity-100" : "-left-9999 -z-1 opacity-0"
      )}
    >
      <div className="flex items-center justify-between p-4 pb-1">
        <h3 className="text-xl font-bold text-black">{popupTitle}</h3>
        <div className="!cursor-pointer" onClick={() => onHide()}>
          <Icon name="x" color="black" />
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-4">
        {data.content.map((content, index) => (
          <div key={index} className="flex flex-col gap-2">
            {content.title && (
              <h3 className="font-bold text-base text-black">
                {content.title}
              </h3>
            )}
            <GroupsFinderDropdownPopupList
              data={content}
              onHide={onHide}
              ageInput={ageInput}
              setAgeInput={setAgeInput}
              popupTitle={popupTitle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const GroupsFinderDropdownPopupList = ({
  data,
  onHide,
  ageInput,
  setAgeInput,
  popupTitle,
}: {
  data: {
    title?: string;
    attribute: string;
    checkbox?: boolean;
    checkboxLayout?: "vertical" | "horizontal";
    input?: boolean;
    inputPlaceholder?: string;
    isAgeRange?: boolean;
    isLocation?: boolean;
    isMeetingDays?: boolean;
    isMeetingType?: boolean;
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
  };
  onHide: () => void;
  ageInput?: string;
  setAgeInput?: (age: string) => void;
  popupTitle?: string;
}) => {
  const { items, refine } = useRefinementList({ attribute: data.attribute });
  const [localAgeInput, setLocalAgeInput] = useState<string>(ageInput || "");

  // Topic categories for filtering
  const spiritualGrowthTopics = ["Bible Study", "Prayer", "Message Discussion"];
  const lifeSupportTopics = ["Marriage", "Parenting", "Finances"];
  const communityFunTopics = [
    "Friendship",
    "Sports",
    "Activty/Hobby",
    "Book Club",
    "Watch Party",
    "Podcast",
  ];

  // Filter items based on category and popup title
  const getFilteredItems = () => {
    if (popupTitle === "Topics" && data.attribute === "topics") {
      if (data.title === "Spiritual Growth") {
        return items.filter((item) =>
          spiritualGrowthTopics.includes(item.label)
        );
      } else if (data.title === "Life & Support") {
        return items.filter((item) => lifeSupportTopics.includes(item.label));
      } else if (data.title === "Community & Fun") {
        return items.filter((item) => communityFunTopics.includes(item.label));
      }
    }
    return items;
  };

  const filteredItems = getFilteredItems();

  // Sync local age input with parent
  useEffect(() => {
    if (ageInput !== undefined) {
      setLocalAgeInput(ageInput);
    }
  }, [ageInput]);

  const reset = () => {
    items.forEach((item) => {
      if (item.isRefined) {
        refine(item.value);
      }
    });
    setLocalAgeInput(""); // Reset local age input
    if (setAgeInput) {
      setAgeInput(""); // Reset parent age input
    }
  };

  const styles = {
    checkbox: "text-text-primary font-regular text-base",
    button:
      "min-w-0 min-h-0 px-2 py-[6px] text-sm font-semibold text-black border border-neutral-light hover:border-ocean transition-all duration-300 rounded-[5px]",
    meetingTypeButton:
      "flex gap-1 text-text-primary font-normal text-base !pr-3",
    buttonRefined:
      "bg-ocean text-white border-ocean hover:!bg-navy hover:!border-navy",
    input:
      "w-full max-w-[120px] text-base px-2 focus:outline-none rounded-[8px] border border-[#AAAAAA] py-2 flex h-full",
  };

  return (
    <>
      <div
        className={cn(
          "flex bg-white",
          data.checkbox && data.checkboxLayout === "vertical"
            ? "gap-4 flex-col"
            : "flex-wrap gap-y-2 gap-x-2"
        )}
      >
        {data.isLocation ? (
          <FinderLocationSearch
            coordinates={data.coordinates || null}
            setCoordinates={data.setCoordinates || (() => {})}
          />
        ) : (
          <>
            {data.input ? (
              <input
                type="number"
                placeholder={data.inputPlaceholder || "Enter your age"}
                className={styles.input}
                value={localAgeInput}
                onChange={(e) => {
                  setLocalAgeInput(e.target.value);
                  if (setAgeInput) {
                    setAgeInput(e.target.value);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                min="13"
                max="120"
              />
            ) : (
              <>
                {filteredItems.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={cn(
                        data.checkboxLayout === "horizontal" &&
                          "flex w-fit gap-x-2 pr-2"
                      )}
                    >
                      {data.checkbox ? (
                        <div
                          className="flex items-center gap-2 w-fit !cursor-pointer"
                          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                            e.stopPropagation();
                            refine(item.value);
                          }}
                        >
                          <div
                            className={cn(
                              "w-4 h-4 border border-ocean rounded-sm bg-[#E7F9FE] hover:bg-ocean transition-all duration-300",
                              item.isRefined && "bg-ocean"
                            )}
                          />
                          <div className={styles.checkbox}>
                            {data.attribute === "adultOnly"
                              ? item.value === "false"
                                ? "Children Welcome"
                                : "Adult Only"
                              : item.label}
                          </div>
                        </div>
                      ) : (
                        <Button
                          key={index}
                          intent="secondary"
                          className={cn(
                            styles.button,
                            data.isMeetingType && styles.meetingTypeButton,
                            item.isRefined && styles.buttonRefined
                          )}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            refine(item.value);
                          }}
                        >
                          {data.isMeetingType && (
                            <Icon
                              name={item.label === "Virtual" ? "globe" : "map"}
                              size={18}
                            />
                          )}
                          {data.isMeetingDays
                            ? item.label === "Thursday"
                              ? "Thur"
                              : item.label.substring(0, 3)
                            : item.label}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer Buttons */}
      {data.showFooter && (
        <div className="mt-5 flex justify-end items-center gap-4 p-2 pt-4 border-t border-neutral-lighter">
          <div
            className="text-black !cursor-pointer hover:text-text-secondary transition-all duration-300"
            onClick={() => reset()}
          >
            Cancel
          </div>

          <Button
            intent="primary"
            className="w-fit px-4 py-1 min-w-0 min-h-0 rounded-full font-semibold text-base"
            onClick={() => onHide()}
          >
            <Stats
              classNames={{
                root: "",
              }}
              translations={{
                rootElementText: ({ nbHits }) =>
                  `Show ${nbHits.toLocaleString()} Results`,
              }}
            />
          </Button>
        </div>
      )}
    </>
  );
};
