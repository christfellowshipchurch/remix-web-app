import { useState } from 'react';
import PrayerRequestConfirmation from './confirmation.component';
import PrayerRequestForm from './prayer-request-form.component';

enum PrayerRequestStep {
  FORM,
  CONFIRMATION,
}

const PrayerRequestFlow = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<PrayerRequestStep>(PrayerRequestStep.FORM);
  const [firstName, setFirstName] = useState('');

  const renderStep = () => {
    switch (step) {
      case PrayerRequestStep.FORM:
        return (
          <PrayerRequestForm
            onSuccess={(submittedFirstName) => {
              setFirstName(submittedFirstName);
              setStep(PrayerRequestStep.CONFIRMATION);
            }}
          />
        );
      case PrayerRequestStep.CONFIRMATION:
        return (
          <PrayerRequestConfirmation
            firstName={firstName}
            onAddAnother={() => {
              setFirstName('');
              setStep(PrayerRequestStep.FORM);
            }}
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

export default PrayerRequestFlow;
