import { useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '~/primitives/Modal';
import { Button } from '~/primitives/button/button.primitive';
import { ButtonProps } from '~/primitives/button/button.primitive';
import { pushFormEvent } from '~/lib/gtm';
import ShareMySkillsFlow from './share-my-skills-flow.component';

interface ShareMySkillsModalProps {
  buttonTitle?: string;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
  children?: ReactNode;
}

export function ShareMySkillsModal({
  buttonTitle = 'Share My Skills',
  triggerStyles,
  TriggerButton = Button,
  children,
}: ShareMySkillsModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent('form_start', 'share_my_skills', 'Share My Skills');
    }
  };

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      {children ? (
        <Modal.Button asChild>{children}</Modal.Button>
      ) : (
        <Modal.Button asChild className='mr-2'>
          <TriggerButton intent='white' className={triggerStyles}>
            {buttonTitle}
          </TriggerButton>
        </Modal.Button>
      )}
      <Modal.Content>
        <ShareMySkillsFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
