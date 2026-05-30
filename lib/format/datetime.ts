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
