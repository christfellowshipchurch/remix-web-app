import { useState } from 'react';

import { cn } from '~/lib/utils';
import Icon from '~/primitives/icon';
import { HTMLRenderer } from '~/primitives/html-renderer/html-renderer.component';

import type { ChurchRole } from '../types';

export function ChurchRoleCard({
  role,
  selected,
  onSelect,
}: {
  role: ChurchRole;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasExpanded = Boolean(role.expandedDescription);

  return (
    <div
      className={cn(
        'rounded-2xl border bg-white p-8 transition-all duration-200 cursor-pointer',
        selected
          ? 'border-ocean bg-ocean/5 shadow-lg ring-1 ring-ocean'
          : 'border-neutral-lighter hover:border-neutral-default',
      )}
      role='radio'
      aria-checked={selected}
      tabIndex={0}
      onClick={() => onSelect(role.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(role.id);
        }
      }}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <p
            className={cn(
              'font-extrabold text-base leading-snug',
              selected ? 'text-ocean' : 'text-text-primary',
            )}
          >
            {role.title}
          </p>
          <HTMLRenderer
            html={role.description}
            className={cn(
              'mt-1 min-w-0 text-sm text-text-secondary leading-relaxed',
              'line-clamp-1',
              // line-clamp applies per block; CMS <p> tags must flow inline for one-line ellipsis
              '[&_p]:m-0',
              '[&_p]:inline',
              '[&_p+_p]:pl-1',
            )}
            stripFormattingTags
          />
        </div>

        <div
          className={cn(
            'mt-0.5 shrink-0 flex size-6 items-center justify-center rounded-full border-2 transition-colors',
            selected
              ? 'border-ocean bg-ocean text-white'
              : 'border-neutral-default bg-white',
          )}
          aria-hidden='true'
        >
          {selected && <Icon name='check' size={14} />}
        </div>
      </div>

      {hasExpanded && (
        <>
          {expanded && role.expandedDescription && (
            <HTMLRenderer
              html={role.expandedDescription}
              className='mt-3 text-sm text-text-secondary leading-relaxed border-t border-neutral-lighter pt-3'
            />
          )}
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className='mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ocean hover:underline'
          >
            {expanded ? 'Read less' : 'Read more'}
            <Icon
              name={expanded ? 'chevronUp' : 'chevronDown'}
              size={14}
              className='shrink-0'
            />
          </button>
        </>
      )}
    </div>
  );
}
