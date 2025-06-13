import { useState, ReactNode } from "react";
import { cn } from "~/lib/utils";
import Modal from "~/primitives/Modal";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { Trip } from "~/routes/volunteer/types";

export interface MissionsModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
  buttonText?: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trip?: Trip;
}

export function MissionsModal({
  ModalButton = Button,
  buttonText = "Learn More",
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trip,
}: MissionsModalProps) {
  const [open, setOpen] = useState(false);
  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(nextOpen);
    } else {
      setOpen(nextOpen);
    }
  };

  return (
    <Modal
      open={isControlled ? controlledOpen : open}
      onOpenChange={handleOpenChange}
    >
      <Modal.Button asChild>
        {trigger ? (
          // If a custom trigger is provided, render it directly
          trigger
        ) : (
          // Otherwise, render the default button
          <ModalButton onClick={() => handleOpenChange(true)}>
            {buttonText}
          </ModalButton>
        )}
      </Modal.Button>
      <Modal.Content>
        <div
          className={cn(
            "flex flex-col md:grid md:grid-cols-2 w-[90vw] lg:max-w-5xl max-h-[90vh] rounded-tl-lg rounded-tr-lg overflow-hidden"
          )}
        >
          {trip?.coverImage && (
            <img
              src={trip.coverImage}
              alt={trip.title}
              className={cn(
                "object-cover w-full max-h-[30vh] md:max-h-none md:h-full",
                "rounded-tl-lg rounded-tr-lg md:rounded-bl-lg md:rounded-tr-none",
                "animate-in fade-in-20 duration-500"
              )}
            />
          )}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-8 px-4 py-12 md:py-16">
            <h2 className="heading-h3">{trip?.title}</h2>
            {/* TODO: Add a dropdown for the group type */}
            <div className="w-64">
              <select
                className={`appearance-none ${defaultTextInputStyles} text-neutral-400`}
                required
                disabled
                style={{
                  backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                  backgroundSize: "24px",
                  backgroundPosition: "calc(100% - 2%) center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option>Choose Group Type</option>
              </select>
            </div>
            <p className="text-neutral-default">
              <HTMLRenderer html={trip?.description || ""} />
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
              <Button
                href={trip?.missionTripUrl}
                target="_blank"
                intent="secondary"
                size="sm"
                className="w-full"
              >
                Help Fund
              </Button>
              <Button
                href={trip?.missionTripUrl}
                target="_blank"
                intent="primary"
                size="sm"
                className="w-full"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}
