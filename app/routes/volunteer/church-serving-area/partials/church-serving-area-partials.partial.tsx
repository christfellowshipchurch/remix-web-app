import { Link } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '~/lib/utils';
import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';

import { volunteerCategoryPillClassName } from '../../volunteer-category-pill';

export function ChurchIntro({
  name,
  tag,
  description,
}: {
  name: string;
  tag: string;
  description: string;
}) {
  return (
    <div className='space-y-4'>
      <span
        className={cn(
          volunteerCategoryPillClassName(tag),
          'lg:text-[14px] font-semibold',
        )}
      >
        {tag}
      </span>
      <h1 className='text-base font-bold leading-tight text-text-primary mt-4'>
        {name}
      </h1>
      <p className='text-base leading-relaxed text-text-secondary'>
        {description}
      </p>
    </div>
  );
}

export function ChurchNotSureLink() {
  return (
    <p className='flex flex-col text-text-secondary pt-12'>
      Not sure which one to choose?{' '}
      <Link
        to='/volunteer#community'
        className='font-semibold text-ocean hover:underline inline-flex items-center gap-1'
      >
        We'll help you find a spot
        <Icon name='arrowRight' size={14} className='shrink-0' />
      </Link>
    </p>
  );
}

export function ChurchMobileContinueBar({
  selectedRoleId,
  onContinue,
}: {
  selectedRoleId: string | null;
  onContinue: () => void;
}) {
  const [mountToBody, setMountToBody] = useState(false);

  useLayoutEffect(() => {
    setMountToBody(true);
  }, []);

  const bar = (
    <div
      className={cn(
        'w-full fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-neutral-lighter bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]',
        'md:hidden',
        'pb-[max(1rem,env(safe-area-inset-bottom,0px))]',
      )}
    >
      <Button
        intent='primary'
        type='button'
        onClick={onContinue}
        disabled={!selectedRoleId}
        className='min-h-12 w-full rounded-full text-base font-bold'
      >
        Continue
      </Button>
    </div>
  );

  if (typeof document === 'undefined') {
    return bar;
  }

  return mountToBody ? createPortal(bar, document.body) : bar;
}
