// Shared date/time formatting — renders timestamps in the VIEWER's local
// timezone (a France client sees France time). All API timestamps are UTC; we
// normalize any that lack a UTC marker so they aren't misread as local time.

// Append "Z" when the string looks like a bare ISO datetime with no timezone
// designator (no trailing Z and no +hh:mm / -hh:mm offset). Mongoose already
// sends a proper "...Z", so this is a safety net.
const normalize = (input: string): string => {
  const looksIsoDateTime = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(input);
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(input.trim());
  if (looksIsoDateTime && !hasZone) {
    return input.replace(" ", "T") + "Z";
  }
  return input;
};

export const parseDate = (
  input?: string | number | Date | null,
): Date | null => {
  if (input === null || input === undefined || input === "") return null;
  const d =
    typeof input === "string" ? new Date(normalize(input)) : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Date only, viewer-local.
export const formatDate = (
  input?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string,
): string => {
  const d = parseDate(input);
  return d ? d.toLocaleDateString(locale, options) : "—";
};

// Date + time, viewer-local. Most timezone-sensitive (audit timestamps).
export const formatDateTime = (
  input?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = {},
  locale?: string,
): string => {
  const d = parseDate(input);
  return d ? d.toLocaleString(locale, options) : "—";
};

// Time only, viewer-local.
export const formatTime = (
  input?: string | number | Date | null,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
  locale?: string,
): string => {
  const d = parseDate(input);
  return d ? d.toLocaleTimeString(locale, options) : "";
};
