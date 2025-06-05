import React, { useRef, useEffect } from "react";
import { Stats, useRefinementList } from "react-instantsearch";
import { icons } from "~/lib/icons";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";

export const GroupsCustomRefinement = ({
  title,
  data,
  showSection,
  onHide,
}: {
  title: string;
  data: {
    content: {
      attribute: string;
      icon?: keyof typeof icons;
      checkbox?: boolean;
      isMeetingType?: boolean;
      showFooter?: boolean;
    }[];
  };
  showSection: boolean;
  onHide: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onHide();
      }
    };

    if (showSection) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSection, onHide]);

  return (
    <div
      ref={ref}
      className={cn(
        "cursor-default absolute top-16 right-1/2 translate-x-1/2 z-4",
        "w-[330px] flex flex-col gap-4 bg-white",
        "rounded-[1rem] border border-neutral-lighter overflow-hidden",
        showSection ? "z-4 opacity-100" : "-z-1 opacity-0"
      )}
    >
      <div className="flex items-center justify-between p-4 pb-1">
        <h3 className="text-xl font-bold text-black">{title}</h3>
        <div className="cursor-pointer" onClick={() => onHide()}>
          <Icon name="x" color="black" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {data.content.map((content) => (
          <GroupsCustomRefinementList
            key={content.attribute}
            data={content}
            onHide={onHide}
          />
        ))}
      </div>
    </div>
  );
};

const GroupsCustomRefinementList = ({
  data,
  onHide,
}: {
  data: {
    attribute: string;
    icon?: keyof typeof icons;
    checkbox?: boolean;
    isMeetingType?: boolean;
    showFooter?: boolean;
  };
  onHide: () => void;
}) => {
  const { items, refine } = useRefinementList({ attribute: data.attribute });
  const reset = () => {
    items.forEach((item) => {
      if (item.isRefined) {
        refine(item.value);
      }
    });
  };

  const checkboxStyle = "text-text-primary font-regular text-base";

  const buttonStyles =
    "min-w-0 min-h-0 px-2 py-[6px] text-sm font-semibold text-black border border-neutral-light hover:border-ocean transition-all duration-300 rounded-[5px]";
  const meetingTypeButtonStyle =
    "flex gap-1 text-text-primary font-normal text-base ";
  const buttonRefinedStyle =
    "bg-ocean text-white border-ocean hover:!bg-navy hover:!border-navy";

  return (
    <>
      <div
        className={cn(
          "flex bg-white px-4",
          data.checkbox ? "gap-4 flex-col" : "flex-wrap gap-y-2 gap-x-2"
        )}
      >
        {items.map((item, index) => {
          return (
            <div key={index}>
              {data.checkbox ? (
                <div
                  className={cn(
                    checkboxStyle,
                    item.isRefined && buttonRefinedStyle
                  )}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    refine(item.value);
                  }}
                >
                  {item.label}
                </div>
              ) : (
                <Button
                  key={index}
                  intent="secondary"
                  className={cn(
                    buttonStyles,
                    data.isMeetingType && meetingTypeButtonStyle,
                    item.isRefined && buttonRefinedStyle
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
                  {item.label}
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {data.showFooter && (
        <div className="mt-5 flex justify-end items-center gap-4 p-2 py-4 border-t border-neutral-lighter">
          <div
            className="text-black cursor-pointer hover:text-text-secondary transition-all duration-300"
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
