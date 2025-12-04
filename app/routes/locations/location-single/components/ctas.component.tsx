import { SetAReminderModal } from "~/components/modals/set-a-reminder/reminder-modal.component";
import { icons } from "~/lib/icons";
import { Icon } from "~/primitives/icon/icon";
import { ButtonProps } from "~/primitives/button/button.primitive";
import { Link } from "react-router-dom";
import React from "react";
import { ShareButton } from "~/components/share-links/share-button.component";

const CTAButtonContent = ({
  icon,
  title,
  ...props
}: {
  icon: keyof typeof icons;
  title: string;
}) => (
  <div
    className="w-[118px] md:w-[140px] items-center justify-center text-center py-3 px-4 flex flex-col gap-1 text-ocean rounded-[1.5rem] lg:rounded-[1rem] border border-neutral-lighter cursor-pointer transition-colors duration-300 hover:bg-neutral-lightest"
    {...props}
  >
    <Icon name={icon} size={36} />
    <p className="text-xs font-bold md:font-extrabold">{title}</p>
  </div>
);

export const CTAs = () => {
  return (
    <div className="w-full flex-wrap justify-center md:justify-start flex gap-4 lg:gap-0 lg:justify-between">
      <CTAButton icon="calendarAlt" title="Set a Reminder" isSetAReminder />
      <CTAButton icon="paperPlane" title="Invite a Friend" isShareButton />
      <CTAButton
        icon="mobileAlt"
        title="Contact Us"
        target="_blank"
        href="mailto:hello@christfellowship.church"
      />
    </div>
  );
};

const CTAButton = ({
  isSetAReminder,
  isShareButton,
  icon,
  target,
  title,
  href,
}: {
  icon: keyof typeof icons;
  title: string;
  href?: string;
  isSetAReminder?: boolean;
  isShareButton?: boolean;
  target?: string;
}) => {
  if (isSetAReminder) {
    const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
      (props, ref) => (
        <button ref={ref} {...props}>
          <CTAButtonContent icon={icon} title={title} />
        </button>
      )
    );

    return <SetAReminderModal ModalButton={CustomButton} />;
  }

  const content = <CTAButtonContent icon={icon} title={title} />;

  if (isShareButton) {
    return (
      <ShareButton shareMessage="Come with me to a service at Christ Fellowship Church!">
        {content}
      </ShareButton>
    );
  }

  return href ? (
    <Link to={href} target={target}>
      {content}
    </Link>
  ) : (
    content
  );
};
