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

export const formatEventFinderDate = (
  dateString: string,
  dayName?: string,
): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = date.getDate();
  const suffix = getDaySuffix(dayNum);
  const weekday =
    dayName || date.toLocaleDateString('en-US', { weekday: 'short' });

  return `${weekday} ${monthName} ${dayNum}${suffix}`;
};

export const normalizeEventFinderDates = (
  date: string | string[] | undefined | null,
): string[] => {
  if (!date) return [];
  const dates = Array.isArray(date) ? date : [date];
  return dates.map((value) => value.trim()).filter(Boolean).sort();
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

export const formatEventFinderDatesDisplay = (
  dates: string[],
  dayName?: string,
): string => {
  const normalizedDates = normalizeEventFinderDates(dates);
  if (normalizedDates.length === 0) return '';
  if (normalizedDates.length === 1) {
    return formatEventFinderDate(normalizedDates[0], dayName);
  }
  return normalizedDates
    .map((date) => formatEventFinderDate(date))
    .join(' & ');
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
