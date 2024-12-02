import { useState, ReactNode } from "react";
import Modal from "~/primitives/Modal";
import ReminderFlow from "./reminder-flow.component";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { dayTimes } from "~/routes/locations/locationSingle/loader";

interface SetAReminderModalProps {
  campus: string;
  ModalButton?: React.ComponentType<ButtonProps>;
  serviceTimes: dayTimes[];
}

export function SetAReminderModal({
  campus,
  ModalButton = Button,
  serviceTimes,
}: SetAReminderModalProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <ModalButton onClick={() => setOpenModal(true)}>
          {campus?.includes("Español") ? "Recuérdame" : "Set a Reminder"}
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <ReminderFlow
          serviceTimes={serviceTimes}
          campus={campus}
          setOpenModal={setOpenModal}
        />
      </Modal.Content>
    </Modal>
  );
}
