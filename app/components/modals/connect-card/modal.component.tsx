import { useState } from "react";
import Modal from "~/primitives/Modal";
import Button from "~/primitives/button";
import { useConnectCardData } from "./connect-card.data";
import ConnectCardFlow from "./connect-card-flow.component";

export default function ConnectCardModal({
  isEspanol,
}: {
  isEspanol?: boolean;
}) {
  const [openModal, setOpenModal] = useState(false);
  /**
   * Todo : This is a custom hook that fetches the connect card data that we want to switch over to so we fetch the form data on page load
   */
  const connectCardData = useConnectCardData();

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <Button intent="white" className="rounded-xl border-0">
          {isEspanol ? "Conéctate" : "Get Connected"}
        </Button>
      </Modal.Button>
      <Modal.Content>
        <ConnectCardFlow
        //connectCardData={connectCardData}
        />
      </Modal.Content>
    </Modal>
  );
}
