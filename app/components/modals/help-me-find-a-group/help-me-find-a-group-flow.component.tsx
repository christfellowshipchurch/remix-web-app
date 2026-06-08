import { useState } from 'react';
import HelpMeFindAGroupConfirmation from './help-me-find-a-group-confirmation.component';
import HelpMeFindAGroupForm from './help-me-find-a-group-form.component';

enum HelpMeFindAGroupStep {
  FORM,
  CONFIRMATION,
}

const HelpMeFindAGroupFlow = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<HelpMeFindAGroupStep>(
    HelpMeFindAGroupStep.FORM,
  );

  const renderStep = () => {
    switch (step) {
      case HelpMeFindAGroupStep.FORM:
        return (
          <HelpMeFindAGroupForm
            onSuccess={() => setStep(HelpMeFindAGroupStep.CONFIRMATION)}
          />
        );
      case HelpMeFindAGroupStep.CONFIRMATION:
        return (
          <HelpMeFindAGroupConfirmation onSuccess={() => setOpenModal(false)} />
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

export default HelpMeFindAGroupFlow;
