import { useState } from "react";
import Modal from "~/primitives/Modal";
import GroupContactFlow from "./group-connect-flow.component";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";

interface GroupConnectModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
  groupName: string;
}

export function GroupConnectModal({
  ModalButton = Button,
  groupName,
}: GroupConnectModalProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Modal open={openModal} onOpenChange={setOpenModal}>
      <Modal.Button asChild className="mr-2">
        <ModalButton onClick={() => setOpenModal(true)}>Contact</ModalButton>
      </Modal.Button>
      <Modal.Content>
        <GroupContactFlow setOpenModal={setOpenModal} groupName={groupName} />
      </Modal.Content>
    </Modal>
  );
}
