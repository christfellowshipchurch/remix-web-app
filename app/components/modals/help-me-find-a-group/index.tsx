import { useState, type ReactNode } from 'react';
import { pushFormEvent } from '~/lib/gtm';
import Modal from '~/primitives/Modal';
import { Button } from '~/primitives/button/button.primitive';
import { ButtonProps } from '~/primitives/button/button.primitive';
import HelpMeFindAGroupFlow from './help-me-find-a-group-flow.component';

interface HelpMeFindAGroupModalProps {
  buttonTitle?: string;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
  children?: ReactNode;
}

export function HelpMeFindAGroupModal({
  buttonTitle = 'Help me find a group',
  triggerStyles,
  TriggerButton = Button,
  children,
}: HelpMeFindAGroupModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent(
        'form_start',
        'help_me_find_a_group',
        'Help Me Find a Group',
      );
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      {children ? (
        <Modal.Button asChild>{children}</Modal.Button>
      ) : (
        <Modal.Button asChild className='mr-2'>
          <TriggerButton intent='white' className={triggerStyles}>
            {buttonTitle}
          </TriggerButton>
        </Modal.Button>
      )}
      <Modal.Content>
        <HelpMeFindAGroupFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
