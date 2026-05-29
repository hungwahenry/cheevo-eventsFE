const DICEBEAR_URL = 'https://api.dicebear.com/9.x/thumbs/png';

/**
 * Deterministic DiceBear avatar URL — mirrors the backend's default avatar
 * (thumbs style, seeded by username) so the preview matches what gets stored.
 */
export function dicebearAvatarUrl(seed: string): string {
  return `${DICEBEAR_URL}?seed=${encodeURIComponent(seed)}`;
}
