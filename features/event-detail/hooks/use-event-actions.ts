import type { ActionItem } from '@/components/ui/actions-sheet';
import type { EventDetail } from '@/features/event-detail/types';
import { useToggleEventMute } from '@/features/notifications/hooks';
import { addToCalendar } from '@/lib/calendar';
import { eventShareUrl } from '@/lib/event-url';
import { haptics } from '@/lib/haptics';
import { Bell, BellOff, CalendarPlus, Flag, Share2 } from 'lucide-react-native';
import * as React from 'react';
import { Platform, Share } from 'react-native';
import { toast } from 'sonner-native';

export function useEventActions(
  event: EventDetail | null,
  handlers: { onReport: (event: EventDetail) => void }
): ActionItem[] {
  const muteToggle = useToggleEventMute(event?.slug ?? '', event?.id ?? '');

  return React.useMemo(() => {
    if (!event) return [];

    return [
      {
        label: 'Share',
        icon: Share2,
        onPress: () => shareEvent(event),
      },
      {
        label: 'Add to calendar',
        icon: CalendarPlus,
        onPress: () => addEventToCalendar(event),
      },
      {
        label: event.is_muted ? 'Unmute notifications' : 'Mute notifications',
        icon: event.is_muted ? Bell : BellOff,
        onPress: () => muteToggle.mutate(),
      },
      {
        label: 'Report',
        icon: Flag,
        destructive: true,
        onPress: () => handlers.onReport(event),
      },
    ];
  }, [event, handlers, muteToggle]);
}

async function shareEvent(event: EventDetail): Promise<void> {
  const url = eventShareUrl(event.slug);
  try {
    await Share.share({
      message: Platform.select({ ios: undefined, default: `${event.title}\n${url}` }),
      url: Platform.select({ ios: url, default: undefined }),
      title: event.title,
    });
  } catch {
    haptics.error();
    toast.error("Couldn't open the share sheet.");
  }
}

async function addEventToCalendar(event: EventDetail): Promise<void> {
  if (!event.starts_at) {
    toast.error('No date set on this event yet.');
    return;
  }

  const result = await addToCalendar({
    title: event.title,
    startsAt: event.starts_at,
    endsAt: event.ends_at,
    timezone: event.timezone,
    location: [event.venue_name, event.address, event.city].filter(Boolean).join(', ') || null,
    notes: eventShareUrl(event.slug),
  });

  switch (result) {
    case 'added':
      haptics.success();
      toast.success('Added to your calendar');
      return;
    case 'denied':
      haptics.error();
      toast.error('Calendar permission required.');
      return;
    case 'no-calendar':
      toast.error('No writable calendar found.');
      return;
    case 'failed':
      haptics.error();
      toast.error("Couldn't add to calendar.");
  }
}
