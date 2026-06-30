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
  initialEmail?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewsletterSubscriptionModal({
  buttonTitle = 'Subscribe to Updates',
  triggerStyles,
  TriggerButton = Button,
  children,
  initialEmail,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: NewsletterSubscriptionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const openModal = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (open: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(open);
    } else {
      setInternalOpen(open);
    }

    if (open) {
      pushFormEvent(
        'form_start',
        'newsletter_subscription',
        'Newsletter Subscription',
      );
    }
  };

  const setOpenModal = (open: boolean) => {
    handleOpenChange(open);
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      {!isControlled &&
        (children ? (
          <Modal.Button asChild>{children}</Modal.Button>
        ) : (
          <Modal.Button asChild className='mr-2'>
            <TriggerButton intent='white' className={triggerStyles}>
              {buttonTitle}
            </TriggerButton>
          </Modal.Button>
        ))}
      <Modal.Content>
        <NewsletterSubscriptionFlow
          setOpenModal={setOpenModal}
          initialEmail={initialEmail}
          isOpen={openModal}
        />
      </Modal.Content>
    </Modal>
  );
}
