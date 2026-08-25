/** Calendar date in the device local timezone: YYYY-MM-DD */
export type LocalDate = string;

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isLocalDate(value: string): value is LocalDate {
  return LOCAL_DATE_RE.test(value);
}

/** Today's date as YYYY-MM-DD in the device local timezone. */
export function todayLocalDate(now: Date = new Date()): LocalDate {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toLocalDate(date: Date): LocalDate {
  return todayLocalDate(date);
}
