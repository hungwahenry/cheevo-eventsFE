const DICEBEAR_URL = 'https://api.dicebear.com/9.x/thumbs/png';

export function dicebearAvatarUrl(seed: string): string {
  return `${DICEBEAR_URL}?seed=${encodeURIComponent(seed)}`;
}
