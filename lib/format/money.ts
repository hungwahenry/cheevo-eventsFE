// Currency display knowledge lives here so callers only need (amount, currency).
// Adding a new currency = one entry below.
const CURRENCY: Record<string, { locale: string; minorUnits: number }> = {
  NGN: { locale: 'en-NG', minorUnits: 100 },
  USD: { locale: 'en-US', minorUnits: 100 },
  GHS: { locale: 'en-GH', minorUnits: 100 },
  KES: { locale: 'en-KE', minorUnits: 100 },
  ZAR: { locale: 'en-ZA', minorUnits: 100 },
};

const DEFAULT_CURRENCY = 'NGN';

function spec(currency: string) {
  return CURRENCY[currency] ?? CURRENCY[DEFAULT_CURRENCY];
}

export function formatMoney(minor: number, currency: string): string {
  const { locale, minorUnits } = spec(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(minor / minorUnits);
}

export function formatPriceRange(
  min: number | null,
  max: number | null,
  currency: string
): string | null {
  if (min === null) return null;
  if (min === 0 && (max === null || max === 0)) return 'Free';
  if (max === null || min === max) return formatMoney(min, currency);
  return `From ${formatMoney(min, currency)}`;
}
