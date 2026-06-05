import { googleCalendarLink, icsLink } from '~/lib/utils';
import { AddToCalendar } from '~/components/add-to-calendar/add-to-calendar.component';
import Icon from '~/primitives/icon';
import HTMLRenderer from '~/primitives/html-renderer';

import {
  collapseHtmlToVisibleText,
  trimRemovingInvisibleUnicode,
} from '~/lib/text-content';

import type { VolunteerMissionDetail } from '../types';

export function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/**
 * Returns trimmed content suitable to render, or `null` when the value is
 * only whitespace, empty HTML (`<p></p>`, `<br>`, `&nbsp;`), or list lines
 * that are all blank after stripping bullets.
 */
export function normalizeWhatToKnowContent(raw: string): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = trimRemovingInvisibleUnicode(raw);
  if (!trimmed) return null;

  if (trimmed.startsWith('<')) {
    return collapseHtmlToVisibleText(trimmed).length > 0 ? trimmed : null;
  }

  const lines = trimmed
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return trimmed;
}

function formatEventTimeRange(mission: VolunteerMissionDetail): string {
  const start = str(mission.eventTimeStr);
  const end = str(mission.eventEndTimeStr);
  if (start && end && start !== end) {
    return `${start} – ${end}`;
  }
  return start || end || '—';
}

function plainTextFromHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/\s*(?:p|div|h[1-6]|li|tr|td|th)\s*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(?:160|x0*A0);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function AddToCalendarButton({
  mission,
  className,
  showLabel = true,
}: {
  mission: VolunteerMissionDetail;
  className?: string;
  showLabel?: boolean;
}) {
  if (!mission.calendarStartDateTime) {
    return null;
  }

  const startTime = new Date(mission.calendarStartDateTime as string);
  if (Number.isNaN(startTime.getTime())) {
    return null;
  }

  const fallbackEndTime = new Date(startTime.getTime() + 60 * 60 * 1000);
  const endTime = mission.calendarEndDateTime
    ? new Date(mission.calendarEndDateTime)
    : fallbackEndTime;

  const eventDetails = {
    title: `CF Missions - ${mission.title}`,
    description: plainTextFromHtml(mission.summary),
    address: mission.campusName || '',
    startTime,
    endTime: Number.isNaN(endTime.getTime()) ? fallbackEndTime : endTime,
    url:
      typeof window !== 'undefined' ? window.location.href : mission.missionsUrl,
  };

  if (!showLabel) {
    // Icon-only compact variant (mobile bottom bar) — simple ICS trigger, no dropdown
    return (
      <button
        type='button'
        className={className}
        onClick={() => {
          window.location.href = icsLink(eventDetails);
        }}
        aria-label='Add to Calendar'
      >
        <Icon name='calendarPlus' size={22} />
      </button>
    );
  }

  return (
    <AddToCalendar
      googleHref={googleCalendarLink(eventDetails)}
      getIcsUrl={() => icsLink(eventDetails)}
      eventDate={startTime}
      className={className}
    />
  );
}

export function MissionDetailRows({
  mission,
}: {
  mission: VolunteerMissionDetail;
}) {
  const locationLabel = str(mission.campusName) || '—';
  const dateLabel = str(mission.eventDateStr) || '—';
  const timeLabel = formatEventTimeRange(mission);

  const rows = [
    { icon: 'map' as const, label: locationLabel },
    { icon: 'calendar' as const, label: dateLabel },
    { icon: 'time' as const, label: timeLabel },
  ];

  return (
    <ul className='flex flex-col gap-4'>
      {rows.map((row) => (
        <li key={row.icon} className='flex items-center gap-3'>
          <span className='mt-0.5 shrink-0 text-neutral-darker'>
            <Icon name={row.icon} size={22} className='text-neutral-darker' />
          </span>
          <span className='text-base font-medium leading-snug text-neutral-darker'>
            {row.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function WhatToKnowBody({ content }: { content: string }) {
  if (content.startsWith('<')) {
    return (
      <div className='prose prose-neutral prose-ul:my-2 max-w-none text-text-secondary'>
        <HTMLRenderer html={content} />
      </div>
    );
  }

  const lines = content
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

  return (
    <ul className='list-disc space-y-2 pl-5 text-base leading-relaxed text-text-secondary'>
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
