import { useEffect, useState } from 'react';
import NewsletterSubscriptionConfirmation from './confirmation.component';
import NewsletterSubscriptionForm from './newsletter-subscription-form.component';

enum NewsletterSubscriptionStep {
  FORM,
  CONFIRMATION,
}

const NewsletterSubscriptionFlow = ({
  setOpenModal,
  initialEmail,
  isOpen,
}: {
  setOpenModal: (open: boolean) => void;
  initialEmail?: string;
  isOpen: boolean;
}) => {
  const [step, setStep] = useState<NewsletterSubscriptionStep>(
    NewsletterSubscriptionStep.FORM,
  );

  useEffect(() => {
    if (!isOpen) {
      setStep(NewsletterSubscriptionStep.FORM);
    }
  }, [isOpen]);

  const renderStep = () => {
    switch (step) {
      case NewsletterSubscriptionStep.FORM:
        return (
          <NewsletterSubscriptionForm
            key={initialEmail ?? 'no-email'}
            onSuccess={() => setStep(NewsletterSubscriptionStep.CONFIRMATION)}
            initialEmail={initialEmail}
          />
        );
      case NewsletterSubscriptionStep.CONFIRMATION:
        return (
          <NewsletterSubscriptionConfirmation
            onSuccess={() => setOpenModal(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='pt-10 text-center text-text_primary p-6 w-[90vw] max-w-sm md:max-w-xl lg:max-w-3xl overflow-y-scroll max-h-[85vh] md:max-h-[90vh]'>
      {renderStep()}
    </div>
  );
};

export default NewsletterSubscriptionFlow;
