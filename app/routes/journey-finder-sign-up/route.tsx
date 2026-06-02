import { useState } from 'react';
import JourneyFinderSignUpForm from '~/components/modals/journey-finder-sign-up/journey-finder-sign-up-form.component';
import JourneyFinderSignUpConfirmation from '~/components/modals/journey-finder-sign-up/confirmation.component';

export { action } from './action';
export { loader } from './loader';
export { meta } from './meta';

export default function JourneyFinderSignUpPage() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return (
    <div className='flex flex-col items-center justify-center px-6 py-20 max-w-screen-sm mx-auto'>
      {isSuccess ? (
        <JourneyFinderSignUpConfirmation />
      ) : (
        <JourneyFinderSignUpForm onSuccess={() => setIsSuccess(true)} />
      )}
    </div>
  );
}
