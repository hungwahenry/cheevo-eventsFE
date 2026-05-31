export function isEventInPresale(presaleUntil: string | null): boolean {
  if (!presaleUntil) return false;
  return new Date(presaleUntil).getTime() > Date.now();
}
