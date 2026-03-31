import type { ClassHitType } from "../../types";

/** One row per distinct `classType` after aggregating Algolia hits. */
export type GroupedClassTypeRow = {
  coverImage: string;
  title: string;
  summary: string;
  subtitle: string;
  topic: ClassHitType["topic"];
  urlSegment: string;
  locations: string;
  format: ClassHitType["format"];
  language: ClassHitType["language"];
};

type Accumulator = {
  coverImage: string;
  title: string;
  summary: string;
  subtitle: string;
  topic: ClassHitType["topic"];
  urlSegment: string;
  format: ClassHitType["format"];
  campusLabels: Set<string>;
  languagesSeen: Set<ClassHitType["language"]>;
  hitCount: number;
};

function classTypeGroupKey(hit: ClassHitType): string {
  return hit.classType?.trim() || hit.title?.trim() || hit.objectID;
}

function locationLabel(campusLabels: Set<string>, hitCount: number): string {
  const distinct = [...campusLabels].filter((l) => l.length > 0);
  if (distinct.length > 1) return "Multiple Locations";
  if (distinct.length === 1) return distinct[0];
  if (hitCount > 1) return "Multiple Locations";
  return "";
}

function languageLabel(
  seen: Set<ClassHitType["language"]>,
): ClassHitType["language"] {
  if (seen.size > 1) return "Multiple Languages";
  return [...seen][0] ?? "English";
}

export function groupClassTypeHits(
  items: ClassHitType[],
): GroupedClassTypeRow[] {
  const byKey = new Map<string, Accumulator>();

  for (const hit of items) {
    const key = classTypeGroupKey(hit);
    const campusLabel = hit.campus?.trim() ?? "";
    const existing = byKey.get(key);

    if (existing) {
      existing.hitCount += 1;
      if (campusLabel) existing.campusLabels.add(campusLabel);
      existing.languagesSeen.add(hit.language);
    } else {
      byKey.set(key, {
        coverImage: hit.coverImage.sources[0]?.uri || "",
        title: hit.classType?.trim() || hit.title,
        urlSegment: hit.classType?.trim() || key,
        summary: hit.summary,
        subtitle: hit.subtitle,
        topic: hit.topic,
        format: hit.format,
        campusLabels: new Set(campusLabel ? [campusLabel] : []),
        languagesSeen: new Set([hit.language]),
        hitCount: 1,
      });
    }
  }

  return [...byKey.values()].map((g) => ({
    coverImage: g.coverImage,
    title: g.title,
    urlSegment: g.urlSegment,
    summary: g.summary,
    subtitle: g.subtitle,
    topic: g.topic,
    locations: locationLabel(g.campusLabels, g.hitCount),
    format: g.format,
    language: languageLabel(g.languagesSeen),
  }));
}

export function syntheticHitsFromGrouped(
  groups: GroupedClassTypeRow[],
): ClassHitType[] {
  return groups.map((group, index) => ({
    objectID: `grouped-${index}`,
    title: group.title,
    classType: group.urlSegment,
    subtitle: group.title,
    summary: group.subtitle,
    coverImage: { sources: [{ uri: group.coverImage }] },
    campus: group.locations,
    groupId: 0,
    _geoloc: { lat: 0, lng: 0 },
    startDate: "",
    endDate: "",
    schedule: "",
    topic: group.topic,
    language: group.language,
    format: group.format,
    _highlightResult: {
      title: { value: group.title, matchLevel: "none", matchedWords: [] },
      summary: {
        value: group.summary,
        matchLevel: "none",
        matchedWords: [],
      },
    },
  }));
}
