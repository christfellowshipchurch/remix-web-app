import { SetAReminderModal } from "~/components/modals/set-a-reminder/reminder-modal.component";
import { icons } from "~/lib/icons";
import { Icon } from "~/primitives/icon/icon";
import { ButtonProps } from "~/primitives/button/button.primitive";
import { Link } from "react-router";
import React from "react";

const CTAButtonContent = ({
  icon,
  title,
  ...props
}: {
  icon: keyof typeof icons;
  title: string;
}) => (
  <div
    className="w-[118px] md:w-[140px] items-center justify-center text-center py-3 px-4 flex flex-col gap-1 text-ocean rounded-[1.5rem] lg:rounded-[1rem] border border-neutral-lighter cursor-pointer"
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
      <CTAButton icon="paperPlane" title="Invite a Friend" href="#todo" />
      <CTAButton
        icon="mobileAlt"
        title="Contact Us"
        href="mailto:hello@christfellowship.church"
      />
    </div>
  );
};

const CTAButton = ({
  isSetAReminder,
  icon,
  title,
  href,
}: {
  icon: keyof typeof icons;
  title: string;
  href?: string;
  isSetAReminder?: boolean;
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
  return href ? <Link to={href}>{content}</Link> : content;
};
