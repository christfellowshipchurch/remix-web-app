import React, { useEffect, useRef } from "react";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

export const VolunteerFormWelcome: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center py-10 bg-white rounded-xl shadow-md max-w-md gap-6 mb-24">
      <h1 className="heading-h3">Help Me Find a Place</h1>
      <p className="text-center text-text-secondary mb-10">
        Thank you for your interest in volunteering with us. We're excited to
        have you join our team.
      </p>
      <div className="grid grid-cols-3 items-center gap-2">
        <div />
        <Button
          ref={buttonRef}
          intent="primary"
          href="/volunteer-form/about-you"
          className="font-normal"
          aria-label="Start Volunteer Form"
          prefetch="viewport"
        >
          Get Started
        </Button>
        <span className="flex items-center gap-1 text-sm text-secondary">
          Press <b>Enter</b>{" "}
          <Icon name="arrowTopRight" className="size-5 text-ocean" />
        </span>
      </div>
      <span className="flex items-center gap-1 text-sm text-secondary">
        <Icon name="timeFive" className="size-5 text-ocean" />
        Takes 1 minute
      </span>
    </section>
  );
};

export default VolunteerFormWelcome;
