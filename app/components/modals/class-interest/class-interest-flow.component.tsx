import { useState } from 'react';
import ClassInterestConfirmation from './confirmation.component';
import ClassInterestForm from './class-interest-form.component';

enum ClassInterestStep {
  FORM,
  CONFIRMATION,
}

const ClassInterestFlow = ({
  setOpenModal,
}: {
  setOpenModal: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<ClassInterestStep>(ClassInterestStep.FORM);

  const renderStep = () => {
    switch (step) {
      case ClassInterestStep.FORM:
        return (
          <ClassInterestForm
            onSuccess={() => setStep(ClassInterestStep.CONFIRMATION)}
          />
        );
      case ClassInterestStep.CONFIRMATION:
        return (
          <ClassInterestConfirmation onSuccess={() => setOpenModal(false)} />
        );
      default:
        return null;
    }
  };

  return (
    <div className='pt-10 text-center text-text_primary p-6 w-[90vw] max-w-sm md:max-w-xl overflow-y-scroll max-h-[85vh] md:max-h-[90vh]'>
      {renderStep()}
    </div>
  );
};

export default ClassInterestFlow;
