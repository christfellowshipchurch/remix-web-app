import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';
import { useNavigate } from 'react-router-dom';

interface BaptismSignUpConfirmationProps {
  onSuccess?: () => void;
}

const BaptismSignUpConfirmation: React.FC<BaptismSignUpConfirmationProps> = ({
  onSuccess,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/');
    }
  };

  return (
    <div className='flex flex-col items-center gap-4 p-8'>
      <Icon name='check' size={64} color='#1ec27f' />
      <h1 className='font-bold text-2xl text-navy'>Thank you!</h1>
      <p className='text-center text-text-secondary'>
        We're so excited you're taking this step. Someone from our team will
        follow up with next steps soon.
      </p>
      <Button
        intent='primary'
        className='rounded-xl w-52'
        onClick={handleClose}
      >
        Continue
      </Button>
    </div>
  );
};

export default BaptismSignUpConfirmation;
