export function formatShortDateTime(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = formatTime(iso) ?? '';
  return `${date} · ${time}`;
}

export function formatTime(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatShortDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeRange(
  starts: string | null,
  ends: string | null
): string | null {
  if (!starts && !ends) return null;
  if (starts && ends) return `${formatTime(starts)} – ${formatTime(ends)}`;
  if (starts) return `From ${formatTime(starts)}`;
  return `Until ${formatTime(ends!)}`;
}

export function formatRelativeShort(iso: string | null): string | null {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w`;
  return formatShortDate(iso);
}

export function formatDateRange(
  starts: string | null,
  ends: string | null
): string | null {
  if (!starts && !ends) return null;
  if (starts && ends) return `${formatShortDate(starts)} – ${formatShortDate(ends)}`;
  if (starts) return `from ${formatShortDate(starts)}`;
  return `until ${formatShortDate(ends!)}`;
}

/** Y-m-d → long-form display (e.g. "2000-03-14" → "March 14, 2000"). */
export function formatBirthday(ymd: string): string {
  return new Date(`${ymd}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Time-of-day "HH:mm" or "HH:mm:ss" → Date today at that time. */
export function parseTimeOfDay(value: string | null, fallback: string = '00:00'): Date {
  const [h, m] = (value ?? fallback).split(':').map((n) => Number(n));
  const d = new Date();
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

/** Date → "HH:mm" for sending to the API. */
export function formatTimeOfDayInput(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/** Time-of-day "HH:mm[:ss]" → locale-formatted display. */
export function formatTimeOfDay(value: string | null): string | null {
  if (!value) return null;
  return parseTimeOfDay(value).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** ISO → "Jul 2025" */
export function formatMonthYear(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}
