import { useState } from "react";
import Modal from "~/primitives/Modal";
import Button from "~/primitives/button";
import ConnectCardFlow from "./connect-card-flow";

export default function ConnectCardModal({
  isEspanol,
}: {
  isEspanol?: boolean;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <Button intent="white" className="rounded-xl border-0">
          {isEspanol ? "Conéctate" : "Get Connected"}
        </Button>
      </Modal.Button>
      <Modal.Content>
        <ConnectCardFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
