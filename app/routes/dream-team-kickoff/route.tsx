import { useEffect, useState } from 'react';
import { pushFormEvent } from '~/lib/gtm';
import DreamTeamKickoffConfirmation from './confirmation.component';
import DreamTeamKickoffForm from './dream-team-kickoff-form.component';

export { action } from './action';
export { loader } from './loader';
export { meta } from './meta';

export default function DreamTeamKickoffPage() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    pushFormEvent(
      'form_start',
      'dream_team_kickoff',
      'Dream Team Kickoff Sign Up',
    );
  }, []);

  return (
    <div className='flex flex-col items-center justify-center px-6 py-20 max-w-screen-sm mx-auto'>
      {isSuccess ? (
        <DreamTeamKickoffConfirmation onSuccess={() => setIsSuccess(false)} />
      ) : (
        <DreamTeamKickoffForm onSuccess={() => setIsSuccess(true)} />
      )}
    </div>
  );
}
