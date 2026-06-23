import { useState, type ReactNode } from 'react';
import { pushFormEvent } from '~/lib/gtm';
import Modal from '~/primitives/Modal';
import { Button, type ButtonProps } from '~/primitives/button/button.primitive';
import GroupFinderNotifyFlow from './group-finder-notify-flow.component';

interface GroupFinderNotifyModalProps {
  buttonTitle?: string;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
  children?: ReactNode;
}

export function GroupFinderNotifyModal({
  buttonTitle = 'Get Notified',
  triggerStyles,
  TriggerButton = Button,
  children,
}: GroupFinderNotifyModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent(
        'form_start',
        'group_finder_notify',
        'Group Finder Notify Me',
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
        <GroupFinderNotifyFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
