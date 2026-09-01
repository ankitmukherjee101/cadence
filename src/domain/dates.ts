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

export function parseLocalDate(date: LocalDate): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const d = parseLocalDate(date);
  d.setDate(d.getDate() + days);
  return toLocalDate(d);
}

export function daysBetween(from: LocalDate, to: LocalDate): number {
  const a = parseLocalDate(from).getTime();
  const b = parseLocalDate(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function eachLocalDate(from: LocalDate, to: LocalDate): LocalDate[] {
  const dates: LocalDate[] = [];
  let cursor = from;
  while (cursor <= to) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

/** Monday of the local week containing `date`. */
export function startOfWeekMonday(date: LocalDate): LocalDate {
  const dow = parseLocalDate(date).getDay(); // 0=Sun … 6=Sat
  const delta = dow === 0 ? -6 : 1 - dow;
  return addDays(date, delta);
}

/** UTC ISO bounds for querying sessions that started on a local calendar date. */
export function localDateUtcBounds(date: LocalDate): { startIso: string; endIso: string } {
  const start = parseLocalDate(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

/** Local noon on `date` as UTC ISO — stable fallback timestamp for timeline ordering. */
export function localNoonIso(date: LocalDate): string {
  const noon = parseLocalDate(date);
  noon.setHours(12, 0, 0, 0);
  return noon.toISOString();
}
