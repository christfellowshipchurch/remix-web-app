import { useState, type ReactNode } from 'react';
import { pushFormEvent } from '~/lib/gtm';
import Modal from '~/primitives/Modal';
import { Button, type ButtonProps } from '~/primitives/button/button.primitive';
import ClassInterestFlow from './class-interest-flow.component';

interface ClassInterestModalProps {
  buttonTitle?: string;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
  children?: ReactNode;
  classValueGuid?: string;
}

export function ClassInterestModal({
  buttonTitle = 'I am interested',
  triggerStyles,
  TriggerButton = Button,
  children,
  classValueGuid,
}: ClassInterestModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent('form_start', 'class_interest', 'Class Interest');
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      {children ? (
        <Modal.Button asChild>{children}</Modal.Button>
      ) : (
        <Modal.Button asChild className='mr-2'>
          <TriggerButton intent='primary' className={triggerStyles}>
            {buttonTitle}
          </TriggerButton>
        </Modal.Button>
      )}
      <Modal.Content>
        <ClassInterestFlow
          setOpenModal={setOpenModal}
          classValueGuid={classValueGuid}
        />
      </Modal.Content>
    </Modal>
  );
}
