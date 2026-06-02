const PUBLIC_HOST = 'https://cheevo.vip';

export function eventShareUrl(slug: string): string {
  return `${PUBLIC_HOST}/events/${slug}`;
}
