import { useState } from 'react';
import { pushFormEvent } from '~/lib/gtm';
import Modal from '~/primitives/Modal';
import { Button } from '~/primitives/button/button.primitive';
import { ButtonProps } from '~/primitives/button/button.primitive';
import type { ReactNode } from 'react';
import PrayerRequestFlow from './prayer-request-flow.component';

interface PrayerRequestModalProps {
  buttonTitle?: string;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
  children?: ReactNode;
}

export function PrayerRequestModal({
  buttonTitle,
  triggerStyles,
  TriggerButton = Button,
  children,
}: PrayerRequestModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent('form_start', 'prayer_request', 'Prayer Request');
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      {children ? (
        <Modal.Button asChild>{children}</Modal.Button>
      ) : (
        <Modal.Button asChild className='mr-2'>
          <TriggerButton intent='white' className={triggerStyles}>
            {buttonTitle ? buttonTitle : 'Prayer Request'}
          </TriggerButton>
        </Modal.Button>
      )}
      <Modal.Content>
        <PrayerRequestFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
