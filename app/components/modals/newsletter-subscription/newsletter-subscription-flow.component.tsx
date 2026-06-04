import { useState } from 'react';
import NewsletterSubscriptionConfirmation from './confirmation.component';
import NewsletterSubscriptionForm from './newsletter-subscription-form.component';

enum NewsletterSubscriptionStep {
  FORM,
  CONFIRMATION,
}

const NewsletterSubscriptionFlow = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<NewsletterSubscriptionStep>(
    NewsletterSubscriptionStep.FORM,
  );

  const renderStep = () => {
    switch (step) {
      case NewsletterSubscriptionStep.FORM:
        return (
          <NewsletterSubscriptionForm
            onSuccess={() => setStep(NewsletterSubscriptionStep.CONFIRMATION)}
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
