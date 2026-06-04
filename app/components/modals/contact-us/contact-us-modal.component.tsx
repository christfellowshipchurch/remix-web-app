import { useState } from 'react';
import Modal from '~/primitives/Modal';
import ContactUsForm from './contact-form.component';
import ContactUsConfirmation from './confirmation.component';

enum ContactUsStep {
  FORM,
  CONFIRMATION,
}

export function ContactUsModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ContactUsStep>(ContactUsStep.FORM);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    // Reset to form when modal closes so it's fresh on next open
    if (!next) setStep(ContactUsStep.FORM);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <Modal.Button asChild>{children}</Modal.Button>
      <Modal.Content>
        <div className='pt-10 p-6 w-[90vw] max-w-sm md:max-w-xl lg:max-w-3xl overflow-y-scroll max-h-[85vh] md:max-h-[90vh]'>
          {step === ContactUsStep.FORM ? (
            <ContactUsForm onSuccess={() => setStep(ContactUsStep.CONFIRMATION)} />
          ) : (
            <ContactUsConfirmation onClose={() => setOpen(false)} />
          )}
        </div>
      </Modal.Content>
    </Modal>
  );
}
