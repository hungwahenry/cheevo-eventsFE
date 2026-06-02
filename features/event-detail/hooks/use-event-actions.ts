import type { ActionItem } from '@/components/ui/actions-sheet';
import type { EventDetail } from '@/features/event-detail/types';
import { useToggleEventMute } from '@/features/notifications/hooks';
import { Bell, BellOff, CalendarPlus, Flag, Link2, Share2 } from 'lucide-react-native';
import * as React from 'react';

export function useEventActions(
  event: EventDetail | null,
  handlers: { onReport: (event: EventDetail) => void }
): ActionItem[] {
  const muteToggle = useToggleEventMute(event?.id ?? '');

  return React.useMemo(() => {
    if (!event) return [];

    return [
      {
        label: 'Share',
        icon: Share2,
        onPress: () => {},
      },
      {
        label: 'Copy link',
        icon: Link2,
        onPress: () => {},
      },
      {
        label: 'Add to calendar',
        icon: CalendarPlus,
        onPress: () => {},
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
