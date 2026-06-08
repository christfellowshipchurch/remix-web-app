import { Button } from '~/primitives/button/button.primitive';

interface HelpMeFindAGroupConfirmationProps {
  onSuccess: () => void;
}

const HelpMeFindAGroupConfirmation: React.FC<
  HelpMeFindAGroupConfirmationProps
> = ({ onSuccess }) => {
  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <h1 className='font-bold text-2xl text-navy'>Thanks!</h1>
      <p className='text-text_primary'>
        Someone from our team will be in touch soon to help you find the perfect
        group.
      </p>
      <Button intent='primary' className='rounded-xl w-52' onClick={onSuccess}>
        Done
      </Button>
    </div>
  );
};

export default HelpMeFindAGroupConfirmation;
