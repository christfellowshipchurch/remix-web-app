import { useState, ReactNode } from "react";
import Modal from "~/primitives/Modal";
import Button from "~/primitives/button";
import { useConnectCardData } from "./connect-card.data";
import ConnectCardFlow from "./connect-card-flow.component";

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
  <Button
    intent="white"
    onClick={onClick}
    className={`rounded-xl border-0 ${className}`}
  >
    {children}
  </Button>
);

interface ConnectCardModalProps {
  isEspanol?: boolean;
  ModalButton?: React.ComponentType<ModalButtonProps>;
}

export default function ConnectCardModal({
  isEspanol,
  ModalButton = DefaultModalButton,
}: ConnectCardModalProps) {
  const [openModal, setOpenModal] = useState(false);
  const connectCardData = useConnectCardData();

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <ModalButton onClick={() => setOpenModal(true)}>
          {isEspanol ? "Conéctate" : "Get Connected"}
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <ConnectCardFlow data={connectCardData} setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
