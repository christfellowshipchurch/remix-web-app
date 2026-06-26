import { Button } from '~/primitives/button/button.primitive';

interface ClassInterestConfirmationProps {
  onSuccess: () => void;
}

const ClassInterestConfirmation: React.FC<ClassInterestConfirmationProps> = ({
  onSuccess,
}) => {
  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <h1 className='font-bold text-2xl text-navy'>Thanks!</h1>
      <p className='text-text_primary'>
        We&apos;ll let you know when this class is offered at a campus near you
        or online.
      </p>
      <Button intent='primary' className='rounded-xl w-52' onClick={onSuccess}>
        Done
      </Button>
    </div>
  );
};

export default ClassInterestConfirmation;
