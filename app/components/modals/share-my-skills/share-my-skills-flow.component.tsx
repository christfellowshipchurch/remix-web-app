import { useState } from 'react';
import ShareMySkillsConfirmation from './confirmation.component';
import ShareMySkillsForm from './share-my-skills-form.component';

enum ShareMySkillsStep {
  FORM,
  CONFIRMATION,
}

const ShareMySkillsFlow = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<ShareMySkillsStep>(ShareMySkillsStep.FORM);

  const renderStep = () => {
    switch (step) {
      case ShareMySkillsStep.FORM:
        return (
          <ShareMySkillsForm
            onSuccess={() => setStep(ShareMySkillsStep.CONFIRMATION)}
          />
        );
      case ShareMySkillsStep.CONFIRMATION:
        return (
          <ShareMySkillsConfirmation onSuccess={() => setOpenModal(false)} />
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

export default ShareMySkillsFlow;
