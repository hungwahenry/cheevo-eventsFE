const NAIRA = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export function formatNaira(kobo: number): string {
  return NAIRA.format(kobo / 100);
}

export function formatPriceRange(min: number | null, max: number | null): string | null {
  if (min === null) return null;
  if (min === 0 && (max === null || max === 0)) return 'Free';
  if (max === null || min === max) return formatNaira(min);
  return `From ${formatNaira(min)}`;
}
