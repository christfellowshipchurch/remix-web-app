import { useState } from "react";
import Modal from "~/primitives/Modal";
import Button from "~/primitives/button";
import ReminderFlow from "./reminder-flow";

export default function SetAReminderModal({
  isEspanol,
}: {
  isEspanol?: boolean;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <Button intent="primary" className="w-full rounded-xl">
          {isEspanol ? "Recuérdame" : "Set a Reminder"}
        </Button>
      </Modal.Button>
      <Modal.Content>
        <ReminderFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
