import { useState } from "react";
import Modal from "~/primitives/Modal";
import ConnectCardFlow from "./connect-card-flow.component";
import { Button } from "~/primitives/button/button.primitive";
import { ButtonProps } from "~/primitives/button/button.primitive";
import { pushFormEvent } from "~/lib/gtm";

interface ConnectCardModalProps {
  buttonTitle?: string;
  isEspanol?: boolean;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
}

export function ConnectCardModal({
  buttonTitle,
  isEspanol,
  triggerStyles,
  TriggerButton = Button,
}: ConnectCardModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent('form_start', 'connect_card', 'Connect Card');
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      <Modal.Button asChild className="mr-2">
        <TriggerButton intent="white" className={triggerStyles}>
          {buttonTitle
            ? buttonTitle
            : isEspanol
            ? "Conéctate"
            : "Get Connected"}
        </TriggerButton>
      </Modal.Button>
      <Modal.Content>
        <ConnectCardFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
