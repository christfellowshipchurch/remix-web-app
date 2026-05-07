import { SetAReminderModal } from '~/components/modals/set-a-reminder/reminder-modal.component';
import { icons } from '~/lib/icons';
import { Icon } from '~/primitives/icon/icon';
import { ButtonProps } from '~/primitives/button/button.primitive';
import { Link } from 'react-router-dom';
import React from 'react';
import { ShareButton } from '~/components/share-links/share-button.component';
import { cn } from '~/lib/utils';

const CTAButtonContent = ({
  icon,
  title,
  ...props
}: {
  icon: keyof typeof icons;
  title: string;
}) => (
  <div
    className='flex h-full min-h-0 w-full min-w-0 max-w-[118px] flex-col items-center justify-center gap-1 rounded-3xl border border-neutral-lighter px-4 py-3 text-center text-ocean transition-colors duration-300 hover:bg-neutral-lightest md:max-w-[140px] lg:rounded-2xl cursor-pointer'
    {...props}
  >
    <Icon name={icon} size={36} className='shrink-0' />
    <p className='flex min-h-0 flex-1 items-center justify-center text-xs font-bold md:font-extrabold'>
      {title}
    </p>
  </div>
);

/** Column + flex-1 on direct child so side CTAs match the tallest slot (row cross-size). */
const ctaSlotClassName =
  'flex min-h-0 flex-1 flex-col items-stretch min-w-0 lg:flex-none [&>*]:flex [&>*]:min-h-0 [&>*]:flex-1 [&>*]:flex-col [&>*]:items-center [&>*]:justify-stretch';

export const CTAs = ({ isSpanish }: { isSpanish?: boolean }) => {
  return (
    <div className='flex w-full flex-1 items-stretch justify-center gap-4 md:justify-start lg:justify-between lg:gap-0'>
      <div className={ctaSlotClassName}>
        <CTAButton
          icon='calendarAlt'
          title={isSpanish ? 'Recuérdame' : 'Set a Reminder'}
          isSetAReminder
        />
      </div>
      <div className={ctaSlotClassName}>
        <CTAButton
          icon='paperPlane'
          title={isSpanish ? 'Invita a un amigo' : 'Invite a Friend'}
          isShareButton
        />
      </div>
      <div className={ctaSlotClassName}>
        <CTAButton
          icon='mobileAlt'
          title={isSpanish ? 'Contáctanos' : 'Contact Us'}
          target='_blank'
          href='mailto:hello@christfellowship.church'
        />
      </div>
    </div>
  );
};

const CTAButton = ({
  isSpanish,
  isSetAReminder,
  isShareButton,
  icon,
  target,
  title,
  href,
}: {
  isSpanish?: boolean;
  icon: keyof typeof icons;
  title: string;
  href?: string;
  isSetAReminder?: boolean;
  isShareButton?: boolean;
  target?: string;
}) => {
  if (isSetAReminder) {
    const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, ...props }, ref) => (
        <button
          ref={ref}
          {...props}
          className={cn(
            'mr-0 flex min-h-0 w-full flex-1 flex-col items-center justify-stretch',
            className,
          )}
        >
          <CTAButtonContent icon={icon} title={title} />
        </button>
      ),
    );

    return <SetAReminderModal ModalButton={CustomButton} />;
  }

  const content = <CTAButtonContent icon={icon} title={title} />;

  if (isShareButton) {
    return (
      <ShareButton
        className='flex min-h-0 w-full flex-1 flex-col items-center justify-stretch'
        shareMessage={
          isSpanish
            ? 'Ven conmigo a un servicio en Christ Fellowship Church!'
            : 'Come with me to a service at Christ Fellowship Church!'
        }
      >
        {content}
      </ShareButton>
    );
  }

  return href ? (
    <Link
      to={href}
      target={target}
      className='flex min-h-0 w-full flex-1 flex-col items-center justify-stretch'
    >
      {content}
    </Link>
  ) : (
    content
  );
};
