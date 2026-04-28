import React, { useEffect, useRef } from 'react';
import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';

export const VolunteerFormWelcome: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <section className='content-padding w-full'>
      <div className='px-4 flex flex-col items-center justify-center bg-white rounded-xl py-10 shadow-md max-w-md md:max-w-xl mx-auto gap-6 mb-24'>
        <h1 className='heading-h3 text-center'>Help Me Find a Place</h1>
        <p className='text-center text-text-secondary mb-10 max-w-md'>
          Thank you for your interest in volunteering with us. We're excited to
          have you join our team.
        </p>
        <div className='grid grid-cols-3 items-center gap-2'>
          <div />
          <Button
            ref={buttonRef}
            intent='primary'
            href='/volunteer-form/about-you'
            className='font-normal'
            aria-label='Start Volunteer Form'
            prefetch='viewport'
          >
            Get Started
          </Button>
          <span className='flex items-center gap-1 text-sm text-secondary'>
            Press <b>Enter</b>{' '}
            <Icon name='arrowTopRight' className='size-5 text-ocean' />
          </span>
        </div>
        <span className='flex items-center gap-1 text-sm text-secondary'>
          <Icon name='timeFive' className='size-5 text-ocean' />
          Takes 1 minute
        </span>
      </div>
    </section>
  );
};

export default VolunteerFormWelcome;
