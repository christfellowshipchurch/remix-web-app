import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";

import type { Volunteer } from "../../types";

export function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function formatEventTimeRange(hit: Volunteer): string {
  const start = str(hit.eventTimeStr);
  const end = str(hit.eventEndTimeStr);
  if (start && end && start !== end) {
    return `${start} – ${end}`;
  }
  return start || end || "—";
}

export function MissionDetailRows({ hit }: { hit: Volunteer }) {
  const locationLabel = str(hit?.checkInLocation) || "—";
  const dateLabel = str(hit?.eventDateStr) || "—";
  const timeLabel = formatEventTimeRange(hit);

  const rows = [
    { icon: "map" as const, label: locationLabel },
    { icon: "calendar" as const, label: dateLabel },
    { icon: "time" as const, label: timeLabel },
  ];

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => (
        <li key={row.icon} className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-neutral-darker">
            <Icon name={row.icon} size={22} className="text-neutral-darker" />
          </span>
          <span className="text-base font-medium leading-snug text-neutral-darker">
            {row.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function WhatToKnowBody({ raw }: { raw: string }) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("<")) {
    return (
      <div className="prose prose-neutral prose-ul:my-2 max-w-none text-text-secondary">
        <HTMLRenderer html={trimmed} />
      </div>
    );
  }

  const lines = trimmed
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  if (!lines.length) return null;

  return (
    <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-text-secondary">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
