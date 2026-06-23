import { Button } from '~/primitives/button/button.primitive';

interface GroupFinderNotifyConfirmationProps {
  onSuccess: () => void;
}

const GroupFinderNotifyConfirmation: React.FC<
  GroupFinderNotifyConfirmationProps
> = ({ onSuccess }) => {
  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <h1 className='font-bold text-2xl text-navy'>Thanks!</h1>
      <p className='text-text_primary'>
        We will let you know when more groups are available.
      </p>
      <Button intent='primary' className='rounded-xl w-52' onClick={onSuccess}>
        Done
      </Button>
    </div>
  );
};

export default GroupFinderNotifyConfirmation;
