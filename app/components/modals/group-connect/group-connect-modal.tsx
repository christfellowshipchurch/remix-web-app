// testing commit

import { useState } from "react";
import Modal from "~/primitives/Modal";
import GroupContactFlow from "./group-connect-flow.component";
import { Button, ButtonProps } from "~/primitives/button/button.primitive";
import { pushFormEvent } from "~/lib/gtm";

interface GroupConnectModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
  buttonText?: string;
  groupName: string;
}

export function GroupConnectModal({
  ModalButton = Button,
  buttonText = "Join Group",
  groupName,
}: GroupConnectModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent("form_start", "group_connect", "Group Connect");
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      <Modal.Button asChild className="mr-2">
        <ModalButton onClick={() => setOpenModal(true)}>
          {buttonText}
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <GroupContactFlow setOpenModal={setOpenModal} groupName={groupName} />
      </Modal.Content>
    </Modal>
  );
}
