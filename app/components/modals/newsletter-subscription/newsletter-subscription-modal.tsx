import { useState } from 'react';
import { pushFormEvent } from '~/lib/gtm';
import Modal from '~/primitives/Modal';
import { Button } from '~/primitives/button/button.primitive';
import { ButtonProps } from '~/primitives/button/button.primitive';
import NewsletterSubscriptionFlow from './newsletter-subscription-flow.component';
import type { ReactNode } from 'react';

interface NewsletterSubscriptionModalProps {
  buttonTitle?: string;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
  children?: ReactNode;
}

export function NewsletterSubscriptionModal({
  buttonTitle = 'Subscribe to Updates',
  triggerStyles,
  TriggerButton = Button,
  children,
}: NewsletterSubscriptionModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent(
        'form_start',
        'newsletter_subscription',
        'Newsletter Subscription',
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
        <NewsletterSubscriptionFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
