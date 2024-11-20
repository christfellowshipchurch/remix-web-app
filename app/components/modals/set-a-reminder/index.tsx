import { useState, ReactNode } from "react";
import Modal from "~/primitives/Modal";
import Button from "~/primitives/button";
import ReminderFlow from "./reminder-flow";

interface ModalButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const DefaultModalButton = ({
  children,
  className,
  onClick,
}: ModalButtonProps) => (
  <Button onClick={onClick} className={`rounded-xl ${className}`}>
    {children}
  </Button>
);

interface SetAReminderModalProps {
  campus?: string;
  ModalButton?: React.ComponentType<ModalButtonProps>;
}

export default function SetAReminderModal({
  campus,
  ModalButton = DefaultModalButton,
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
