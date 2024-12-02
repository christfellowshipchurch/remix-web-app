import { useState, ReactNode } from "react";
import Modal from "~/primitives/Modal";
import ReminderFlow from "./reminder-flow";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
interface SetAReminderModalProps {
  campus?: string;
  ModalButton?: React.ComponentType<ButtonProps>;
}

export default function SetAReminderModal({
  campus,
  ModalButton = Button,
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
        <ReminderFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
