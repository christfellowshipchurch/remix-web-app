import { useState } from "react";
import Modal from "~/primitives/Modal";
import ReminderFlow from "./reminder-flow.component";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { LoaderReturnType } from "~/routes/locations/location-single/loader";
import { useLoaderData } from "react-router-dom";
import { cn } from "~/lib/utils";
import { pushFormEvent } from "~/lib/gtm";

interface SetAReminderModalProps {
  className?: string;
  intent?: ButtonProps["intent"];
  ModalButton?: React.ComponentType<ButtonProps>;
}

export function SetAReminderModal({
  className,
  intent = "secondary",
  ModalButton = Button,
}: SetAReminderModalProps) {
  const [openModal, setOpenModal] = useState(false);
  const { campusUrl } = useLoaderData<LoaderReturnType>();

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent('form_start', 'set_a_reminder', 'Set a Reminder');
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      <Modal.Button asChild className="mr-2">
        <ModalButton
          intent={intent}
          onClick={() => setOpenModal(true)}
          className={cn(
            "text-white border-[#FAFAFC] rounded-md md:rounded-none border hover:bg-white/10",
            className
          )}
        >
          {campusUrl?.includes("iglesia") ? "Recuérdame" : "Set a Reminder"}
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <ReminderFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
