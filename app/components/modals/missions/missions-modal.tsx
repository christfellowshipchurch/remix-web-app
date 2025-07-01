import { useState, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { cn } from "~/lib/utils";
import Modal from "~/primitives/Modal";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { Trip } from "~/routes/volunteer/types";
import { loader } from "~/routes/volunteer/loader";
import { Icon } from "~/primitives/icon/icon";

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
  trip: initialTrip,
}: MissionsModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(
    initialTrip || null
  );

  const { missionTrips } = useLoaderData<typeof loader>();
  const filteredTrips: Trip[] = missionTrips[initialTrip?.country || ""] || [];

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
          {selectedTrip?.coverImage && (
            <img
              src={selectedTrip.coverImage}
              alt={selectedTrip.title}
              className={cn(
                "object-cover w-full max-h-[30vh] md:max-h-none md:h-full",
                "rounded-tl-lg rounded-tr-lg md:rounded-bl-lg md:rounded-tr-none",
                "animate-in fade-in-20 duration-500"
              )}
            />
          )}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-8 px-4 py-12 md:py-16 max-h-[90vh] lg:max-h-[700px]">
            <h2 className="heading-h3">{selectedTrip?.country}</h2>
            <div className="w-64">
              <span className="text-text-secondary block mb-2">
                Choose Group Type
              </span>
              <select
                className={cn(
                  defaultTextInputStyles,
                  "appearance-none cursor-pointer"
                )}
                required
                value={selectedTrip?.id || ""}
                onChange={(e) => {
                  const tripId = e.target.value;
                  const trip = filteredTrips.find(
                    (t) => t.id === Number(tripId)
                  );
                  setSelectedTrip(trip || null);
                }}
                style={{
                  backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                  backgroundSize: "24px",
                  backgroundPosition: "calc(100% - 2%) center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {filteredTrips &&
                  filteredTrips.map((trip: Trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.groupType}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 text-text-primary">
              <div className="flex gap-3 items-center">
                <Icon name="world" />
                <p className="font-semibold">
                  {selectedTrip?.city}, {selectedTrip?.country}
                </p>{" "}
              </div>
              <div className="flex gap-3 items-center">
                <Icon name="calendarAlt" />
                <p className="font-semibold">{selectedTrip?.dateOfTrip}</p>
              </div>
              <div className="flex gap-3 items-center">
                <Icon name="dollar" />
                <p className="font-semibold">{selectedTrip?.cost}</p>
              </div>
            </div>
            <p className="text-neutral-default">
              <HTMLRenderer html={selectedTrip?.description || ""} />
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
              <Button
                href={selectedTrip?.donateUrl}
                target="_blank"
                intent="secondary"
                size="sm"
                className="w-full"
              >
                Help Fund
              </Button>
              {selectedTrip?.applyUrl && selectedTrip.applyUrl !== "" && (
                <Button
                  href={selectedTrip?.applyUrl}
                  target="_blank"
                  intent="primary"
                  size="sm"
                  className="w-full"
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}
