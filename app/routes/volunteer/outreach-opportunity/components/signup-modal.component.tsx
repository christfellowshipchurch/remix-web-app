import { useEffect, useState } from 'react';

import Modal from '~/primitives/Modal';
import { Button } from '~/primitives/button/button.primitive';

import SignupForm from './signup-form.component';

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupGuid: string;
  waiverLinkText: string;
  /** Path the form posts to — the outreach-opportunity route's own action. */
  actionPath: string;
}

export function SignupModal({
  open,
  onOpenChange,
  groupGuid,
  waiverLinkText,
  actionPath,
}: SignupModalProps) {
  const [succeeded, setSucceeded] = useState(false);

  // Reset to form view whenever the modal is reopened.
  useEffect(() => {
    if (open) setSucceeded(false);
  }, [open]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <div className="text-text-primary p-6 md:p-10 overflow-auto overflow-x-hidden w-[90vw] max-w-2xl max-h-[85vh] md:max-h-[90vh]">
          {succeeded ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-navy">
                You&apos;re signed up!
              </h2>
              <p className="text-text-secondary">
                Thanks for signing up. We&apos;ll be in touch with next steps.
              </p>
              <Button
                intent="primary"
                className="rounded-full w-52 mt-2"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-6">
                Sign up to serve
              </h2>
              <SignupForm
                groupGuid={groupGuid}
                waiverLinkText={waiverLinkText}
                actionPath={actionPath}
                onSuccess={() => setSucceeded(true)}
              />
            </>
          )}
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default SignupModal;
