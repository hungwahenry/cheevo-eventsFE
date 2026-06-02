const compactFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** 1_234 → "1.2K", 1_234_567 → "1.2M" */
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}
