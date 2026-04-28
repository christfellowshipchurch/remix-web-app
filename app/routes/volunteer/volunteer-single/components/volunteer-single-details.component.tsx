import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";

import type { VolunteerMissionDetail } from "../types";

export function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** BOM / ZWSP / word joiner — often sneak in from CMS or paste. */
const INVISIBLE_CHARS = /[\uFEFF\u200B-\u200D\u2060]/g;

function stripHtmlToVisibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/\s*(?:p|div|h[1-6]|li|tr|td|th)\s*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(?:160|x0*A0);/gi, " ")
    .replace(/\s+/g, "")
    .trim();
}

/**
 * Returns trimmed content suitable to render, or `null` when the value is
 * only whitespace, empty HTML (`<p></p>`, `<br>`, `&nbsp;`), or list lines
 * that are all blank after stripping bullets.
 */
export function normalizeWhatToKnowContent(raw: string): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.replace(INVISIBLE_CHARS, "").trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("<")) {
    return stripHtmlToVisibleText(trimmed).length > 0 ? trimmed : null;
  }

  const lines = trimmed
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
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
  return start || end || "—";
}

export function MissionDetailRows({
  mission,
}: {
  mission: VolunteerMissionDetail;
}) {
  const locationLabel = str(mission.campusName) || "—";
  const dateLabel = str(mission.eventDateStr) || "—";
  const timeLabel = formatEventTimeRange(mission);

  const rows = [
    { icon: "map" as const, label: locationLabel },
    { icon: "calendar" as const, label: dateLabel },
    { icon: "time" as const, label: timeLabel },
  ];

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => (
        <li key={row.icon} className="flex items-center gap-3">
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

export function WhatToKnowBody({ content }: { content: string }) {
  if (content.startsWith("<")) {
    return (
      <div className="prose prose-neutral prose-ul:my-2 max-w-none text-text-secondary">
        <HTMLRenderer html={content} />
      </div>
    );
  }

  const lines = content
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  return (
    <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-text-secondary">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
