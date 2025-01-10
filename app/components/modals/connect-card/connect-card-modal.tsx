import { useState } from "react";
import Modal from "~/primitives/Modal";
import { useConnectCardData } from "./connect-card.data";
import ConnectCardFlow from "./connect-card-flow.component";
import Button from "~/primitives/button";
import { ButtonProps } from "~/primitives/button/button.primitive";

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
  const connectCardData = useConnectCardData();

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
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
        <ConnectCardFlow data={connectCardData} setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
