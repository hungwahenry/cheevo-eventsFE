import { config } from '@/lib/config';

export function eventShareUrl(slug: string): string {
  return `${config.webUrl}/events/${slug}`;
}
