const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const normalizeEventFinderDates = (
  date: string | string[] | undefined | null,
): string[] => {
  if (!date) return [];
  const dates = Array.isArray(date) ? date : [date];
  return dates
    .map((value) => value.trim())
    .filter(Boolean)
    .sort();
};

export const serializeEventFinderDates = (dates: string[]): string => {
  return normalizeEventFinderDates(dates).join('|');
};

export const parseSerializedEventFinderDates = (
  serializedDates: string,
): string[] => {
  if (!serializedDates.trim()) return [];
  return normalizeEventFinderDates(serializedDates.split('|'));
};

export const eventFinderDatesMatch = (
  hitDates: string | string[] | undefined | null,
  selectedSerializedDates: string,
): boolean => {
  return (
    serializeEventFinderDates(normalizeEventFinderDates(hitDates)) ===
    selectedSerializedDates.trim()
  );
};

export const formatEventFinderDateLabel = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = date.getDate();
  const suffix = getDaySuffix(dayNum);

  return `${monthName} ${dayNum}${suffix}`;
};

export const formatEventFinderDatesDisplay = (
  dates: string[],
  day?: string,
): string => {
  const normalizedDates = normalizeEventFinderDates(dates);
  if (normalizedDates.length === 0) return '';

  const dateLabels = normalizedDates.map(formatEventFinderDateLabel).join(' & ');
  return day ? `${day} ${dateLabels}` : dateLabels;
};
