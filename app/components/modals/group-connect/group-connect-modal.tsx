import { useState, type ReactNode } from 'react';
import Modal from '~/primitives/Modal';
import GroupContactFlow from './group-connect-flow.component';
import { Button, ButtonProps } from '~/primitives/button/button.primitive';
import { pushFormEvent } from '~/lib/gtm';

interface GroupConnectModalProps {
  ModalButton?: React.ComponentType<ButtonProps>;
  buttonText?: string;
  /** When set, renders inside the trigger instead of `buttonText` (e.g. a full card). */
  triggerChildren?: ReactNode;
  groupId: string;
  campus?: string;
}

export function GroupConnectModal({
  ModalButton = Button,
  buttonText = 'Join Group',
  triggerChildren,
  groupId,
  campus,
}: GroupConnectModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent('form_start', 'group_signup', 'Group/Class Signup');
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      <Modal.Button asChild>
        <ModalButton onClick={() => setOpenModal(true)}>
          {triggerChildren ?? buttonText}
        </ModalButton>
      </Modal.Button>
      <Modal.Content>
        <GroupContactFlow
          setOpenModal={setOpenModal}
          groupId={groupId}
          campus={campus}
        />
      </Modal.Content>
    </Modal>
  );
}
