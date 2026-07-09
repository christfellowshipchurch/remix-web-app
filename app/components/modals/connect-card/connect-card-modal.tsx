import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '~/primitives/Modal';
import ConnectCardFlow from './connect-card-flow.component';
import { Button } from '~/primitives/button/button.primitive';
import { ButtonProps } from '~/primitives/button/button.primitive';
import { pushFormEvent } from '~/lib/gtm';
import type { ReactNode } from 'react';

interface ConnectCardModalProps {
  buttonTitle?: string;
  isEspanol?: boolean;
  triggerStyles?: string;
  TriggerButton?: React.ComponentType<ButtonProps>;
  children?: ReactNode;
}

/** Standalone connect card page; ?lang=es tells it to self-translate (see route.tsx). */
const CONNECT_CARD_ESPANOL_PATH = '/connect-card?lang=es';

export function ConnectCardModal({
  buttonTitle,
  isEspanol,
  triggerStyles,
  TriggerButton = Button,
  children,
}: ConnectCardModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);
    if (open) {
      pushFormEvent('form_start', 'connect_card', 'Connect Card');
    }
  };

  // Spanish campuses: the in-modal form is English markup machine-translated
  // in place. Send visitors to the standalone /connect-card page instead, so
  // it can translate itself natively rather than layering a translation on
  // top of a modal that was never meant to be Spanish.
  if (isEspanol) {
    const handleEspanolClick = () =>
      pushFormEvent('form_start', 'connect_card', 'Connect Card');

    return children ? (
      <Link
        to={CONNECT_CARD_ESPANOL_PATH}
        className={triggerStyles}
        onClick={handleEspanolClick}
      >
        {children}
      </Link>
    ) : (
      <TriggerButton
        intent='white'
        className={triggerStyles}
        href={CONNECT_CARD_ESPANOL_PATH}
        onClick={handleEspanolClick}
      >
        {buttonTitle ?? 'Conéctate'}
      </TriggerButton>
    );
  }

  return (
    <Modal open={openModal} onOpenChange={handleOpenChange}>
      {children ? (
        <Modal.Button asChild>{children}</Modal.Button>
      ) : (
        <Modal.Button asChild className='mr-2'>
          <TriggerButton intent='white' className={triggerStyles}>
            {buttonTitle ?? 'Get Connected'}
          </TriggerButton>
        </Modal.Button>
      )}
      <Modal.Content>
        <ConnectCardFlow setOpenModal={setOpenModal} />
      </Modal.Content>
    </Modal>
  );
}
