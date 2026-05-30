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
