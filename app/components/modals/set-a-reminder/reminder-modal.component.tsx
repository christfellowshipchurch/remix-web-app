import { useState } from "react";
import Modal from "~/primitives/Modal";
import ReminderFlow from "./reminder-flow.component";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { LoaderReturnType } from "~/routes/locations/locationSingle/loader";
import { useLoaderData } from "react-router";

interface SetAReminderModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
}

export function SetAReminderModal({
  ModalButton = Button,
}: SetAReminderModalProps) {
  const [openModal, setOpenModal] = useState(false);
  const { name } = useLoaderData<LoaderReturnType>();

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <ModalButton onClick={() => setOpenModal(true)}>
          {name?.includes("Español") ? "Recuérdame" : "Set a Reminder"}
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <ReminderFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
