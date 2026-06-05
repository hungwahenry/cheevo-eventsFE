import { useUnreadCount } from '@/features/notifications/hooks/use-inbox';
import { setAppBadgeCount } from '@/lib/notifications';
import { useEffect } from 'react';

export function useBadgeSync(): void {
  const { data } = useUnreadCount();
  const count = data?.unread ?? 0;

  useEffect(() => {
    void setAppBadgeCount(count);
  }, [count]);
}
