import { useState } from 'react';
import BaptismSignUpForm from '~/components/modals/baptism-sign-up/baptism-sign-up-form.component';
import BaptismSignUpConfirmation from '~/components/modals/baptism-sign-up/confirmation.component';

export { action } from './action';
export { loader } from './loader';
export { meta } from './meta';

export default function BaptismSignUpFormPage() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return (
    <div className='flex flex-col items-center justify-center px-6 py-20 max-w-screen-sm mx-auto'>
      {isSuccess ? (
        <BaptismSignUpConfirmation />
      ) : (
        <BaptismSignUpForm onSuccess={() => setIsSuccess(true)} />
      )}
    </div>
  );
}
