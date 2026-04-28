import camelCase from "lodash/camelCase";
import { format, isValid } from "date-fns";

import { fetchRockData, TTL } from "~/lib/.server/fetch-rock-data";
import { escapeOData } from "~/lib/.server/rock-utils";
import { createImageUrlFromGuid } from "~/lib/utils";

import type { VolunteerMissionDetail } from "./types";

type AttrEntry = {
  value?: string;
  valueFormatted?: string;
};

type AttrBag = Record<string, AttrEntry | undefined>;

/** Rock `Groups` row (after `normalize`) plus `Campus` / `GroupType` expands. */
type RockMissionGroup = {
  id?: number;
  name?: string;
  description?: string;
  campus?: { name?: string; shortCode?: string };
  groupType?: { name?: string };
  attributeValues?: AttrBag;
};

function attrKeysRock(keys: string[]): string[] {
  const out: string[] = [];
  for (const key of keys) {
    out.push(key, camelCase(key), key.charAt(0).toLowerCase() + key.slice(1));
  }
  return [...new Set(out)];
}

function readAttrEntry(
  attrs: AttrBag | undefined,
  keys: string[],
): AttrEntry | undefined {
  if (!attrs) return undefined;
  for (const k of attrKeysRock(keys)) {
    const e = attrs[k];
    if (!e) continue;
    const hasValue = e.value != null && String(e.value).trim() !== "";
    const hasFormatted =
      e.valueFormatted != null && String(e.valueFormatted).trim() !== "";
    if (hasValue || hasFormatted) return e;
  }
  return undefined;
}

function readAttr(
  attrs: AttrBag | undefined,
  keys: string[],
): string | undefined {
  const e = readAttrEntry(attrs, keys);
  const v = e?.value;
  if (v != null && String(v).trim() !== "") return String(v).trim();
  return undefined;
}

/** Prefer Rock `ValueFormatted` when present (e.g. times, person name). */
function readAttrFormatted(
  attrs: AttrBag | undefined,
  keys: string[],
): string | undefined {
  const e = readAttrEntry(attrs, keys);
  const f = e?.valueFormatted;
  if (f != null && String(f).trim() !== "") return String(f).trim();
  const v = e?.value;
  if (v != null && String(v).trim() !== "") return String(v).trim();
  return undefined;
}

function parseRockDateTime(value: string): Date | null {
  const t = value.trim();
  if (!t) return null;
  const d = new Date(t);
  return isValid(d) ? d : null;
}

/** `HH:mm:ss` or `H:mm:ss` on same calendar day as `base`. */
function parseTimeOnDate(base: Date, timeHHmmss: string): Date | null {
  const m = timeHHmmss.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const out = new Date(base.getTime());
  out.setHours(Number(m[1]), Number(m[2]), m[3] != null ? Number(m[3]) : 0, 0);
  return isValid(out) ? out : null;
}

function buildEventSchedule(attrs: AttrBag | undefined): {
  eventDateStr: string;
  eventTimeStr: string;
  eventEndTimeStr: string | undefined;
} {
  const startRaw = readAttr(attrs, ["EventStartDateTime"]);
  const startFormatted = readAttrFormatted(attrs, ["EventStartDateTime"]);

  let eventDateStr = "—";
  let eventTimeStr = "—";
  let eventEndTimeStr: string | undefined;

  const startDate = startRaw ? parseRockDateTime(startRaw) : null;

  if (startDate) {
    eventDateStr = format(startDate, "M/d/yyyy");
    eventTimeStr = format(startDate, "h:mm a");
  } else if (startFormatted) {
    const m = startFormatted.match(/^(.+?)\s+(\d{1,2}:\d{2}\s*(?:AM|PM))$/i);
    if (m) {
      eventDateStr = m[1].trim();
      eventTimeStr = m[2].trim();
    } else {
      eventDateStr = startFormatted;
    }
  }

  const endTimeFormatted = readAttrFormatted(attrs, ["EventEndTime"]);
  const endTimeRaw = readAttr(attrs, ["EventEndTime"]);

  if (endTimeFormatted && !/^\d{1,2}:\d{2}:\d{2}/.test(endTimeFormatted)) {
    eventEndTimeStr = endTimeFormatted;
  } else if (endTimeRaw && /^\d{1,2}:\d{2}/.test(endTimeRaw) && startDate) {
    const endOnStartDay = parseTimeOnDate(startDate, endTimeRaw);
    if (endOnStartDay) {
      eventEndTimeStr = format(endOnStartDay, "h:mm a");
    }
  } else if (endTimeFormatted) {
    eventEndTimeStr = endTimeFormatted;
  }

  return { eventDateStr, eventTimeStr, eventEndTimeStr };
}

function resolveImageUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  return createImageUrlFromGuid(t);
}

async function getPersonIdFromPersonAliasGuid(
  aliasGuid: string,
): Promise<string | null> {
  const res = await fetchRockData({
    endpoint: "PersonAlias",
    queryParams: {
      $filter: `Guid eq guid'${escapeOData(aliasGuid)}'`,
      $top: "1",
    },
    ttl: TTL.NONE,
  });
  const row = Array.isArray(res) ? res[0] : res;
  const pid = row?.personId ?? row?.PersonId;
  return pid != null ? String(pid) : null;
}

async function fetchPersonNameEmail(
  personId: string,
): Promise<{ name?: string; email?: string }> {
  try {
    const p = await fetchRockData({
      endpoint: `People/${personId}`,
      queryParams: {
        $select: "FirstName,LastName,NickName,Email",
      },
      ttl: TTL.NONE,
    });
    if (!p || typeof p !== "object") return {};
    const nick = typeof p.nickName === "string" ? p.nickName.trim() : "";
    const first = typeof p.firstName === "string" ? p.firstName.trim() : "";
    const last = typeof p.lastName === "string" ? p.lastName.trim() : "";
    const email = typeof p.email === "string" ? p.email.trim() : undefined;
    const name = [nick || first, last].filter(Boolean).join(" ").trim();
    return { name: name || undefined, email };
  } catch {
    return {};
  }
}

async function resolveContact(attrs: AttrBag | undefined): Promise<{
  contactName?: string;
  contactEmail?: string;
}> {
  if (!attrs) return {};

  const formattedName = readAttrFormatted(attrs, ["ContactPerson"]);
  const personIdRaw = readAttr(attrs, ["ContactPersonId"]) ?? "";
  const aliasGuid = readAttr(attrs, ["ContactPerson"]) ?? "";

  let personId = /^\d+$/.test(personIdRaw) ? personIdRaw : "";
  const guidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!personId && aliasGuid && guidRe.test(aliasGuid)) {
    const fromAlias = await getPersonIdFromPersonAliasGuid(aliasGuid);
    if (fromAlias) personId = fromAlias;
  }

  if (!personId) {
    return formattedName
      ? { contactName: formattedName, contactEmail: undefined }
      : {};
  }

  const { name, email } = await fetchPersonNameEmail(personId);
  return {
    contactName: name || formattedName || undefined,
    contactEmail: email,
  };
}

/**
 * Loads one volunteer / mission opportunity from Rock by GUID (default: `Groups.Guid`).
 */
export async function fetchVolunteerMissionDetailFromRock(
  groupGuid: string,
): Promise<VolunteerMissionDetail | null> {
  const guid = groupGuid.trim();
  if (!guid) return null;

  const filter = `Guid eq guid'${escapeOData(guid)}'`;

  let raw: unknown;
  try {
    raw = await fetchRockData({
      endpoint: "Groups",
      queryParams: {
        $filter: filter,
        $top: "1",
        $expand: "Campus,GroupType",
        loadAttributes: "expanded",
      },
      ttl: TTL.SHORT,
    });
  } catch {
    return null;
  }

  const row: RockMissionGroup | undefined = Array.isArray(raw)
    ? raw[0]
    : (raw as RockMissionGroup | undefined);

  if (!row || typeof row !== "object") return null;

  const attrs = row.attributeValues;
  const title =
    readAttr(attrs, ["Title"]) ||
    (typeof row.name === "string" ? row.name.trim() : "") ||
    "Volunteer opportunity";

  const category =
    readAttr(attrs, ["Category"]) ||
    (typeof row.groupType?.name === "string"
      ? row.groupType.name.trim()
      : "") ||
    "Volunteer opportunity";

  const campusName =
    (typeof row.campus?.name === "string" && row.campus.name.trim()) ||
    (typeof row.campus?.shortCode === "string" &&
      row.campus.shortCode.trim()) ||
    readAttrFormatted(attrs, ["CampusLocation"]) ||
    readAttr(attrs, ["CampusName"]) ||
    undefined;

  const coverRaw = readAttr(attrs, ["Photo"]) ?? "";
  const coverImageUrl = resolveImageUrl(coverRaw);

  const summary =
    readAttr(attrs, ["PublicDescription"]) ||
    (typeof row.description === "string" ? row.description.trim() : "") ||
    "";

  const whatToKnow = readAttr(attrs, ["EmailInfo"]) || "";

  const questionsHtml =
    readAttr(attrs, ["QuestionsHtml", "ContactIntro", "Questions"]) || "";

  const spotsRaw = readAttr(attrs, ["SpotsLeft"]);
  let spotsLeftDisplay: string | number | undefined;
  if (spotsRaw !== undefined) {
    const n = Number(spotsRaw);
    spotsLeftDisplay =
      Number.isFinite(n) && String(n) === spotsRaw ? n : spotsRaw;
  }

  const checkInLocation =
    readAttr(attrs, ["CheckInLocation"]) || campusName || "—";

  const { eventDateStr, eventTimeStr, eventEndTimeStr } =
    buildEventSchedule(attrs);

  const missionsUrl = `https://rock.gocf.org/page/1038?Group=${encodeURIComponent(guid)}`;

  const contact = await resolveContact(attrs);

  return {
    title,
    category,
    coverImageUrl,
    summary,
    whatToKnow,
    questionsHtml: questionsHtml || undefined,
    spotsLeftDisplay,
    campusName,
    checkInLocation,
    eventDateStr,
    eventTimeStr,
    eventEndTimeStr,
    missionsUrl,
    contactName: contact.contactName,
    contactEmail: contact.contactEmail,
  };
}
